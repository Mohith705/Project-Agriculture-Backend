import express from "express";
import { customerOnly } from "../middlewares/auth.js";
import { getDashboardCounts } from "../controllers/dashboardController.js";

const router = express.Router();

// CUSTOMER DASHBOARD
router.get("/stats", customerOnly, getDashboardCounts);

export default router;
