import { Local } from '.prisma/client';
import { conflictError } from '@/errors';
import activitiesRepository from '@/repositories/activities-repository';

async function getActivitiesByDataId(dataId: number, userId: number): Promise<ActivitiesArray> {
  const allActivities = await activitiesRepository.findByDataId(dataId, userId);
  for (const activity of allActivities) {
    activity.activities = activity.activities.map( (a) => ({
      ...a, subscribed: a.Chosen_Activities.length > 0, Chosen_Activities: undefined
    }))
  }
  return allActivities;
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
      throw conflictError();
    }
  }
}
export const VerifyHour = (start: Date, end: Date, selectedStart: Date, selectedEnd: Date) => {
  if (start.getTime() === selectedStart.getTime() || end.getTime() === selectedEnd.getTime()) return true;
  if (selectedStart < end && selectedStart > start) return true;
  if (selectedEnd > start && selectedEnd < end) return true;
  return false;
};

type ActivitiesArray = Local[];

const activitiesService = {
  getActivitiesByDataId,
  getDate,
  postChosenActiv,
};

export default activitiesService;
