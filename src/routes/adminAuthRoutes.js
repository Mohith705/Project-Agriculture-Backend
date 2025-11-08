import { Router } from "express";
import validate from "../middlewares/validate.js";
import { adminSignupValidation, adminLoginValidation } from "../validations/adminAuth.validation.js";
import * as adminAuth from "../controllers/adminAuthController.js";

const router = Router();

/**
 * @swagger
 * /admin/auth/signup:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: Admin created successfully
 */
router.post("/admin/auth/signup", validate(adminSignupValidation), adminAuth.adminSignup);

/**
 * @swagger
 * /admin/auth/login:
 *   post:
 *     summary: Login admin
 *     tags: [Admin Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 */
router.post("/admin/auth/login", validate(adminLoginValidation), adminAuth.adminLogin);

export default router;
