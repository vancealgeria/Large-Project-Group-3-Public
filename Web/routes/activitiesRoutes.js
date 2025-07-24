import express from "express";
import {
  editCategories,
  retrieveTodayEditFields,
  displayLeaderboard,
  retrieveHistory,
  retrieveToEditHistory,
  editHistoricalCategories,
  timerUpdateForDay,
  retrieveHomePageData
} from "../controllers/activitiesController.js";
import auth from "../middlewares/auth.js";

// Creating an instance of Express router
const router = express.Router();


router.post("/editcategories", editCategories);

router.post("/retrievetodayeditfields", retrieveTodayEditFields);

router.post("/displayleaderboard", displayLeaderboard);

router.post("/retrievehistory", retrieveHistory);

router.post("/retrievetoedithistory", retrieveToEditHistory);

router.post("/edithistoricalcategories", editHistoricalCategories);

router.post("/timerupdateforday", timerUpdateForDay);

router.post("/retrievehomepagedata", retrieveHomePageData);







export { router as activitiesRoutes };
