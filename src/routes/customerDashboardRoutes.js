import express from "express";
import { protect, customerOnly } from "../middlewares/auth.js";
import { getDashboardCounts } from "../controllers/dashboardController.js";

const router = express.Router();

// CUSTOMER DASHBOARD
router.get("/stats", protect, customerOnly, getDashboardCounts);

export default router;
