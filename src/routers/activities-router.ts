import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getActivities, getDates, postChosenActivity } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/:dataId", getActivities)
  .get("/date", getDates)
  .post("/", postChosenActivity);

export { activitiesRouter };
