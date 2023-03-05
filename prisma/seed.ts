import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();
const now = dayjs().toDate();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: 'Driven.t',
        logoImageUrl: 'https://files.driveneducation.com.br/images/logo-rounded.png',
        backgroundImageUrl: 'linear-gradient(to right, #FA4098, #FFD77F)',
        startsAt: now,
        endsAt: dayjs(now).add(21, 'days').toDate(),
      },
    });
  }

  console.log({ event });

  await prisma.ticketType.createMany({
    data: [
      {
        name: 'Evento Remoto',
        price: 100,
        isRemote: true,
        includesHotel: false,
        updatedAt: now,
      },
      {
        name: 'Evento Presencial',
        price: 150,
        isRemote: false,
        includesHotel: false,
        updatedAt: now,
      },
      {
        name: 'Evento com Hospedagem',
        price: 250,
        isRemote: false,
        includesHotel: true,
        updatedAt: now,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });