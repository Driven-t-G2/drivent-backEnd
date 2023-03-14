import { Activities } from ".prisma/client";
import activitiesRepository from "@/repositories/activities-repository";

async function getActivitiesByDataId(dataId: number): Promise<ActivitiesArray> {
  const activities = await activitiesRepository.findByDataId(dataId);
  return activities;
}

async function getDate() {
  const dates = await activitiesRepository.findData();
  return dates;
}
async function postChosenActiv(activityId: number, userId: number) {
  const chosen = await activitiesRepository.insertChosenActivity(activityId, userId);
  return chosen;
}

type ActivitiesArray = Activities[];

const activitiesService = {
  getActivitiesByDataId,
  getDate,
  postChosenActiv,
};

export default activitiesService;
