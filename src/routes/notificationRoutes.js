import { Router } from "express";
import validate from "../middlewares/validate.js";
import * as notificationCtrl from "../controllers/notificationController.js";
import {
    getNotificationsValidation,
    notificationIdValidation,
    sendNotificationToCustomerValidation,
    sendNotificationToAllValidation
} from "../validations/notification.validation.js";
import { protect, customerOnly, adminOnly } from "../middlewares/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications for logged-in customer
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by read status
 *     responses:
 *       200:
 *         description: Notifications fetched successfully
 */
router.get(
    "/notifications",
    protect,
    customerOnly,
    validate(getNotificationsValidation),
    notificationCtrl.getNotifications
);

/**
 * @swagger
 * /notifications/unread-count:
 *   get:
 *     summary: Get unread notification count
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count fetched successfully
 */
router.get(
    "/notifications/unread-count",
    protect,
    customerOnly,
    notificationCtrl.getUnreadCount
);

/**
 * @swagger
 * /notifications/{notificationId}/read:
 *   patch:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 */
router.patch(
    "/notifications/:notificationId/read",
    protect,
    customerOnly,
    validate(notificationIdValidation),
    notificationCtrl.markAsRead
);

/**
 * @swagger
 * /notifications/read-all:
 *   patch:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.patch(
    "/notifications/read-all",
    protect,
    customerOnly,
    notificationCtrl.markAllAsRead
);

/**
 * @swagger
 * /notifications/delete-all:
 *   delete:
 *     summary: Delete all notifications for logged-in customer
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications deleted successfully
 */
router.delete(
    "/notifications/delete-all",
    protect,
    customerOnly,
    notificationCtrl.deleteAllNotifications
);

/**
 * @swagger
 * /notifications/{notificationId}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 */
router.delete(
    "/notifications/:notificationId",
    protect,
    customerOnly,
    validate(notificationIdValidation),
    notificationCtrl.deleteNotification
);

/**
 * @swagger
 * /notifications/admin/send-to-customer:
 *   post:
 *     summary: Admin - Send notification to a specific customer
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             customerId: "673a4b8d4e..."
 *             title: "New Listing Available"
 *             body: "Check out the latest tractor listing in your area"
 *             type: "listing"
 *             data: { listingId: "123" }
 *     responses:
 *       201:
 *         description: Notification sent successfully
 */
router.post(
    "/notifications/admin/send-to-customer",
    protect,
    adminOnly,
    validate(sendNotificationToCustomerValidation),
    notificationCtrl.sendNotificationToCustomer
);

/**
 * @swagger
 * /notifications/admin/send-to-all:
 *   post:
 *     summary: Admin - Send notification to all active customers
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             title: "System Maintenance"
 *             body: "The system will be under maintenance tonight"
 *             type: "system"
 *             data: {}
 *     responses:
 *       201:
 *         description: Notification sent to all customers
 */
router.post(
    "/notifications/admin/send-to-all",
    protect,
    adminOnly,
    validate(sendNotificationToAllValidation),
    notificationCtrl.sendNotificationToAll
);

export default router;
