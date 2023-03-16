import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getActivities, getDates, postChosenActivity } from "@/controllers";
import { listActivitiesMd } from "@/middlewares/listactivities-middleware";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .all("/*", listActivitiesMd)
  .get("/date", getDates)
  .get("/:dataId", getActivities)
  .post("/", postChosenActivity);

export { activitiesRouter };
