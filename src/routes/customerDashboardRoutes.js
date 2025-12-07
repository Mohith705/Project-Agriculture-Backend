import express from "express";
import { protect, customerOnly } from "../middlewares/auth.js";
import { paymentCheck } from "../middlewares/paymentCheck.js";
import { getDashboardCounts } from "../controllers/dashboardController.js";

const router = express.Router();

// CUSTOMER DASHBOARD
router.get("/stats", protect, customerOnly, paymentCheck, getDashboardCounts);

export default router;
