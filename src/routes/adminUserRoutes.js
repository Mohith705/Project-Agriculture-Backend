import express from "express";
import { protect, adminOnly } from "../middlewares/auth.js";
import { getAllCustomers, suspendCustomer, deleteCustomer, unsuspendCustomer } from "../controllers/adminUserController.js";

const router = express.Router();

/**
 * @swagger
 * /admin/users/all:
 *   get:
 *     summary: Get all customers
 *     tags: [Admin Users]
 *     responses:
 *       200:
 *         description: List of customers
 */
router.get("/all", protect, adminOnly, getAllCustomers);

/**
 * @swagger
 * /admin/users/suspend/{id}:
 *   put:
 *     summary: Suspend a customer
 *     tags: [Admin Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Customer suspended
 */
router.put("/suspend/:id", protect, adminOnly, suspendCustomer);

/**
 * @swagger
 * /admin/users/delete/{id}:
 *   delete:
 *     summary: Delete a customer
 *     tags: [Admin Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Customer deleted
 */
router.delete("/delete/:id", protect, adminOnly, deleteCustomer);

/**
 * @swagger
 * /admin/users/unsuspend/{id}:
 *   patch:
 *     summary: Unsuspend a customer
 *     tags: [Admin Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Customer unsuspended
 */
router.patch("/unsuspend/:id", protect, adminOnly, unsuspendCustomer);

export default router;
