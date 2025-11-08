import express from "express";
import { auth } from "../middlewares/auth.js";
import { getDashboardCounts } from "../controllers/dashboardController.js";

const router = express.Router();

// CUSTOMER DASHBOARD
router.get("/stats", auth("customer"), getDashboardCounts);

export default router;
