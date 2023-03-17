import app, { init } from '@/app';
import { prisma } from '@/config';
import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import e from 'express';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createPayment,
  generateCreditCardData,
  createTicketTypeWithHotel,
  createTicketTypeRemote,
  createHotel,
  createRoomWithHotelId,
} from '../factories';
import { createActivity, createDates } from '../factories/activity-factory';
import { cleanDb, generateValidToken } from '../helpers';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /activities/date', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/activities');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe("When token is valid",()=>{
    it("should respond with status 402 when user ticket is remote ", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemote();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
        //Hoteis no banco
  
        const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);
  
        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
      });
  
      it("should respond with status 404 when user has no enrollment ", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
  
        const ticketType = await createTicketTypeRemote();
  
        const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);
  
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });
      it("should respond with status 200 and dates", async ()=>{
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
        await createDates();
        
  
        const response = await server.get(`/activities`).set("Authorization", `Bearer ${token}`);
  
        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toEqual([{
            id: expect.any(Number),
            data: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        },])
      })
  })
});

describe('GET /activities/:dataId', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.get('/activities/1');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await server.get('/activities/1').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.get('/activities/1').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    describe("When token is valid",()=>{
        it("should respond with status 402 when user ticket is remote ", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
            //Hoteis no banco
      
            const response = await server.get("/activities/1").set("Authorization", `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
          });
      
          it("should respond with status 404 when user has no enrollment ", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
      
            const ticketType = await createTicketTypeRemote();
      
            const response = await server.get("/activities/1").set("Authorization", `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
          });
          it("should respond with status 200 and activities", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
            const date = await createDates();
            const activity = await createActivity(date.id)
            
      
            const response = await server.get(`/activities/${date.id}`).set("Authorization", `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual([{
              id: expect.any(Number),
              name: expect.any(String),
              data_id: date.id,
              start_time: expect.any(String),
              end_time: expect.any(String),
              local: expect.any(String),
              capacity: expect.any(Number),
              duration: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              Chosen_Activities: []
            },])
          })
    })
  });
  describe('POST /activities/:activityId', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.post('/activities/1');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await server.post('/activities/1').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.post('/activities/1').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    describe("When token is valid",()=>{
        it("should respond with status 402 when user ticket is remote ", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
            //Hoteis no banco
      
            const response = await server.post("/activities/1").set("Authorization", `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
          });
      
          it("should respond with status 404 when user has no enrollment ", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
      
            const ticketType = await createTicketTypeRemote();
      
            const response = await server.post("/activities/1").set("Authorization", `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
          });
          it("should respond with status 200", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
            const date = await createDates();
            const activity = await createActivity(date.id)
            
      
            const response = await server.post(`/activities/${activity.id}`).set("Authorization", `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.OK);
          })
    })
  });
