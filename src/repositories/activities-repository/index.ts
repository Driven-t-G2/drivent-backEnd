import { prisma } from '@/config';

async function findByDataId(dateId: number, userId: number) {
  return prisma.local.findMany({
    where: {
      activities: {
        some: {
          AND: [
            {
              Dates: {
                id: dateId,
              },
            },
            {
              data_id: dateId,
            },
          ],
        },
      },
    },
    include: {
      activities: {
        include: {
          _count: true,
          Chosen_Activities: {
            where: {
              user_id: userId,
            },
          },
        },
        where: {
          data_id: dateId,
        },
      },
    },
  });
}

async function findData() {
  return prisma.dates.findMany({ orderBy: { data: 'asc' } });
}

async function insertChosenActivity(activityId: number, userId: number) {
  return prisma.chosen_Activities.create({
    data: {
      activity_id: activityId,
      user_id: userId,
    },
  });
}

async function findById(activityId: number) {
  return prisma.activities.findFirst({
    where: {
      id: activityId,
    },
  });
}

async function findChosenByUserId(userId: number) {
  return prisma.chosen_Activities.findMany({
    include: {
      Activities: true,
    },
    where: {
      user_id: userId,
    },
  });
}

const activitiesRepository = {
  findByDataId,
  findData,
  insertChosenActivity,
  findChosenByUserId,
  findById,
};

export default activitiesRepository;
