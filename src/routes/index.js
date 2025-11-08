import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../config/swagger.js";

import adminAuthRoutes from "./adminAuthRoutes.js";
import adminListingRoutes from "./adminListingRoutes.js";
import adminUserRoutes from "./adminUserRoutes.js";
import customerAuthRoutes from "./customerAuthRoutes.js";
import customerDashboardRoutes from "./customerDashboardRoutes.js";
import listingRoutes from "./listingRoutes.js";
// import leadRoutes from "./leadRoutes.js";
// import paymentRoutes from "./paymentRoutes.js";

const router = express.Router();

// Swagger UI
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// All API routes
router.use(adminAuthRoutes);
router.use("/admin/listings", adminListingRoutes);
router.use("/admin/users", adminUserRoutes);
router.use(customerAuthRoutes);
router.use("/dashboard", customerDashboardRoutes);
router.use("/listings", listingRoutes);
// router.use("/leads", leadRoutes);
// router.use("/payments", paymentRoutes);

export default router;
