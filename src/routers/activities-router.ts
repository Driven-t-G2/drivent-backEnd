import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getActivities, getDates, postChosenActivity } from "@/controllers";
import { listActivitiesMd } from "@/middlewares/listactivities-middleware";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken,listActivitiesMd)
  .get("/:dataId", getActivities)
  .get("/", getDates)
  .post("/:activityId", postChosenActivity);

export { activitiesRouter };
