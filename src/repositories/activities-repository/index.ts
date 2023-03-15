import { prisma } from "@/config";

async function findByDataId(dataId: number) {
  return prisma.activities.findMany({
    include: {
      Chosen_Activities: true,
    },
    where: {
      data_id: dataId,
    },
  });
}

async function findData() {
  return prisma.dates.findMany();
}

async function insertChosenActivity(activityId: number, userId: number) {
  return prisma.chosen_Activities.create({
    data: {
      activity_id: activityId,
      user_id: userId,
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
};

export default activitiesRepository;
