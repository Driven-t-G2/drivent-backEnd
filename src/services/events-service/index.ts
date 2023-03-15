import { notFoundError } from "@/errors";
import eventRepository from "@/repositories/event-repository";
import { exclude } from "@/utils/prisma-utils";
import { Event } from "@prisma/client";
import dayjs from "dayjs";
import { redis } from "@/config";

async function getFirstEventWithCache(): Promise<GetFirstEventResult> {
  const cacheKey = "firstEvent";

  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const event = await eventRepository.findFirst();
  if (!event) throw notFoundError();
  const result = exclude(event, "createdAt", "updatedAt");

  redis.set(cacheKey, JSON.stringify(result), "EX", 600);

  return result;
}

async function isCurrentEventActive(): Promise<boolean> {
  const event = await eventRepository.findFirst();
  if (!event) return false;

  const now = dayjs();
  const eventStartsAt = dayjs(event.startsAt);
  const eventEndsAt = dayjs(event.endsAt);

  return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
}

const eventsService = {
  getFirstEvent: getFirstEventWithCache,
  isCurrentEventActive,
};

export type GetFirstEventResult = Omit<Event, "createdAt" | "updatedAt">;
export default eventsService;
