import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import activitiesService from "@/services/activities-service";

export async function getActivities(req: AuthenticatedRequest, res: Response) {
  const { dataId } = req.params;

  try {
    const activities = await activitiesService.getActivitiesByDataId(Number(dataId));
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "cannotListHotelsError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getDates(req: AuthenticatedRequest, res: Response) {
  try {
    const dates = await activitiesService.getDate();
    return res.status(httpStatus.OK).send(dates);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "cannotListHotelsError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function postChosenActivity(req: AuthenticatedRequest, res: Response) {
  const { activityId } = req.params;
  const { userId } = req;

  try {
    const activities = await activitiesService.postChosenActiv(Number(activityId), Number(userId));
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "cannotListHotelsError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
