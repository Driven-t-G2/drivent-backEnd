import faker from '@faker-js/faker';
import { prisma } from '@/config';

export function createDate() {
  const date = faker.date.soon(0);
  return date;
}
export function createDateBetween(date1: Date, date2: Date) {
  const date = faker.date.between(date1, date2);
  console.log(date);
  return date;
}
export function createDateBefore(date1: Date) {
  const date = faker.date.recent(0, date1);
  return date;
}
export function createDateAfter(date1: Date) {
  const date = faker.date.soon(0, date1);
  return date;
}
export async function createDates() {
  return prisma.dates.create({
    data: {
      data: faker.name.firstName(),
    },
  });
}

export async function createActivity(data_id:number) {
    const date = createDate();
  return prisma.activities.create({
    data:{
        name: faker.name.firstName(),
        data_id: data_id,
        start_time: date,
        end_time: createDateAfter(date),
        local: faker.name.firstName(),
        capacity: Number(faker.random.numeric(2)),
        duration: Number(faker.random.numeric(2))
    }
  })
}
