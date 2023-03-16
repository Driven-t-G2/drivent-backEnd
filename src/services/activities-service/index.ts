import { Activities } from ".prisma/client";
import { conflictError } from "@/errors";
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
  const activity = await activitiesRepository.findById(activityId);
  const chosenActiv = await activitiesRepository.findChosenByUserId(userId);
  if (!chosenActiv) {
    const chosen = await activitiesRepository.insertChosenActivity(activityId, userId);
    return chosen;
  } else {
    let bool = true;
    for (let index = 0; index < chosenActiv.length; index++) {
      const start = chosenActiv[index].Activities.start_time;
      const end = chosenActiv[index].Activities.end_time;
      if (VerifyHour(start, end, activity.start_time, activity.end_time)) {
        bool = false;
        break;
      } else {
        continue;
      }
    }
    if (bool) {
      const chosen = await activitiesRepository.insertChosenActivity(activityId, userId);
      return chosen;
    } else {
      throw conflictError("Activities hours Don't match");
    }
  }
}
const VerifyHour = (start: Date, end: Date, selectedStart: Date, selectedEnd: Date) => {
  if (start === selectedStart || end === selectedEnd) return true;
  if (selectedStart < end && selectedStart > start) return true;
  if (selectedEnd > start && selectedEnd < end) return true;
  return false;
};

type ActivitiesArray = Activities[];

const activitiesService = {
  getActivitiesByDataId,
  getDate,
  postChosenActiv,
};

export default activitiesService;
