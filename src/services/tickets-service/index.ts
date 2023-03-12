import { notFoundError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { TicketStatus } from '@prisma/client';
import { redis } from '@/config';

const TICKET_TYPES_CACHE_KEY = 'ticketTypes';

async function getTicketTypes() {
  const cachedTicketTypes = await redis.get(TICKET_TYPES_CACHE_KEY);
  if (cachedTicketTypes) {
    return JSON.parse(cachedTicketTypes);
  }

  const ticketTypes = await ticketRepository.findTicketTypes();

  if (!ticketTypes) {
    throw notFoundError();
  }

  await redis.set(TICKET_TYPES_CACHE_KEY, JSON.stringify(ticketTypes));

  return ticketTypes;
}

async function getTicketByUserId(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }

  return ticket;
}

async function createTicket(userId: number, ticketTypeId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticketData = {
    ticketTypeId,
    enrollmentId: enrollment.id,
    status: TicketStatus.RESERVED,
  };

  await ticketRepository.createTicket(ticketData);

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  return ticket;
}

const ticketService = {
  getTicketTypes,
  getTicketByUserId,
  createTicket,
};

export default ticketService;
