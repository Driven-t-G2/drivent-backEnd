import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import { redis } from "@/config";

async function listHotels(userId: number) {
  const cacheKey = `listHotels:${userId}`;
  const cachedResult = await redis.get(cacheKey);
  if (cachedResult) {
    return JSON.parse(cachedResult);
  }

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }

  const result = "hotels found";

  await redis.set(cacheKey, JSON.stringify(result), "EX", 3600);

  return result;
}

async function getHotels(userId: number) {
  const cacheKey = `getHotels:${userId}`;
  const cachedResult = await redis.get(cacheKey);
  if (cachedResult) {
    return JSON.parse(cachedResult);
  }

  await listHotels(userId);
  const hotels = await hotelRepository.findHotels();

  await redis.set(cacheKey, JSON.stringify(hotels), "EX", 3600);

  return hotels;
}

async function getHotelsWithRooms(userId: number, hotelId: number) {
  const cacheKey = `getHotelsWithRooms:${userId}:${hotelId}`;
  const cachedResult = await redis.get(cacheKey);
  if (cachedResult) {
    return JSON.parse(cachedResult);
  }

  await listHotels(userId);
  const hotel = await hotelRepository.findRoomsByHotelId(hotelId);

  if (!hotel) {
    throw notFoundError();
  }

  await redis.set(cacheKey, JSON.stringify(hotel), "EX", 3600);

  return hotel;
}

const hotelService = {
  getHotels,
  getHotelsWithRooms,
};

export default hotelService;
