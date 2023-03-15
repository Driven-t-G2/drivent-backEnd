import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getActivities, getDates, postChosenActivity } from "@/controllers";
import { listActivitiesMd } from "@/middlewares/listactivities-middleware";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .all("/*", listActivitiesMd)
  .get("/:dataId", getActivities)
  .get("/date", getDates)
  .post("/", postChosenActivity);

export { activitiesRouter };
