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

   const hotel1 = await prisma.hotel.create({
    data: {
      name: 'Hotel Maravilhoso',
      image: 'https://pix10.agoda.net/hotelImages/124/1246280/1246280_16061017110043391702.jpg?ca=6&ce=1&s=1024x768',
    },
  });

  const hotel2 = await prisma.hotel.create({
    data: {
      name: 'Hotel Fantástico',
      image: 'https://pix10.agoda.net/hotelImages/124/1246280/1246280_16061017110043391702.jpg?ca=6&ce=1&s=1024x768',
    },
  });

  await prisma.room.createMany({
    data: [
      {
        name: 'Quarto Luxo 1',
        capacity: 2,
        hotelId: hotel1.id,
      },
      {
        name: 'Quarto Luxo 2',
        capacity: 3,
        hotelId: hotel1.id,
      },
      {
        name: 'Quarto Simples 1',
        capacity: 1,
        hotelId: hotel1.id,
      },
      {
        name: 'Quarto Simples 2',
        capacity: 2,
        hotelId: hotel1.id,
      },
      {
        name: 'Quarto Familiar 1',
        capacity: 3,
        hotelId: hotel1.id,
      },
      {
        name: 'Quarto Luxo 1',
        capacity: 2,
        hotelId: hotel2.id,
      },
      {
        name: 'Quarto Luxo 2',
        capacity: 3,
        hotelId: hotel2.id,
      },
      {
        name: 'Quarto Simples 1',
        capacity: 1,
        hotelId: hotel2.id,
      },
      {
        name: 'Quarto Simples 2',
        capacity: 2,
        hotelId: hotel2.id,
      },
      {
        name: 'Quarto Familiar 1',
        capacity: 3,
        hotelId: hotel2.id,
      },
    ],
  });

  const local1 = await prisma.local.create({
    data: {
      name: "auditorio1"
    }
  });

  const local2 = await prisma.local.create({
    data: {
      name: "Auditorio Lateral"
    }
  });

  const data1 = await prisma.dates.create({
    data: {
      data: "2023/03/20"
    }
  });

  const data2 = await prisma.dates.create({
    data: {
      data: "2023/03/21"
    }
  });

  const activit1 = await prisma.activities.create({
    data: {
      name: "atividade1",
      data_id: data1.id,           
      start_time: dayjs().toDate(),
      end_time: dayjs().add(2, 'hours').toDate(),        
      local_id: local1.id,
      capacity: 20,
      duration: 2
    }
  })

  await prisma.activities.create({
    data: {
      name: "atividade2",
      data_id: data1.id,           
      start_time: activit1.start_time,
      end_time: activit1.end_time,        
      local_id: local2.id,
      capacity: 20,
      duration: 2
    }
  })
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
