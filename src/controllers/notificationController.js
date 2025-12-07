import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import Notification from "../models/Notification.js";
import Customer from "../models/Customer.js";
import { createNotification, createBulkNotifications } from "../utils/notificationService.js";

/**
 * Get all notifications for logged-in customer
 */
export const getNotifications = catchAsync(async (req, res) => {
    const customerId = req.user._id;
    const { page = 1, limit = 20, isRead } = req.query;

    const filter = { customer: customerId };
    if (isRead !== undefined) {
        filter.isRead = isRead === "true";
    }

    const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ customer: customerId, isRead: false });

    res.status(200).json({
        status: true,
        message: "Notifications fetched successfully",
        notifications,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / limit)
        },
        unreadCount
    });
});

/**
 * Get unread notification count
 */
export const getUnreadCount = catchAsync(async (req, res) => {
    const customerId = req.user._id;

    const unreadCount = await Notification.countDocuments({
        customer: customerId,
        isRead: false
    });

    res.status(200).json({
        status: true,
        unreadCount
    });
});

/**
 * Mark notification as read
 */
export const markAsRead = catchAsync(async (req, res) => {
    const customerId = req.user._id;
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, customer: customerId },
        { isRead: true, readAt: new Date() },
        { new: true }
    );

    if (!notification) throw new ApiError(httpStatus.NOT_FOUND, "Notification not found");

    res.status(200).json({
        status: true,
        message: "Notification marked as read",
        notification
    });
});

/**
 * Mark all notifications as read
 */
export const markAllAsRead = catchAsync(async (req, res) => {
    const customerId = req.user._id;

    const result = await Notification.updateMany(
        { customer: customerId, isRead: false },
        { isRead: true, readAt: new Date() }
    );

    res.status(200).json({
        status: true,
        message: "All notifications marked as read",
        modifiedCount: result.modifiedCount
    });
});

/**
 * Delete a notification
 */
export const deleteNotification = catchAsync(async (req, res) => {
    const customerId = req.user._id;
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        customer: customerId
    });

    if (!notification) throw new ApiError(httpStatus.NOT_FOUND, "Notification not found");

    res.status(200).json({
        status: true,
        message: "Notification deleted successfully"
    });
});

/**
 * Delete all notifications for logged-in customer
 */
export const deleteAllNotifications = catchAsync(async (req, res) => {
    const customerId = req.user._id;

    const result = await Notification.deleteMany({ customer: customerId });

    res.status(200).json({
        status: true,
        message: "All notifications deleted successfully",
        deletedCount: result.deletedCount
    });
});

/**
 * Admin: Send notification to a specific customer
 */
export const sendNotificationToCustomer = catchAsync(async (req, res) => {
    const { customerId, title, body, type, data } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) throw new ApiError(httpStatus.NOT_FOUND, "Customer not found");

    const result = await createNotification(
        customerId,
        title,
        body,
        type,
        data
    );

    if (!result.success) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, result.error);
    }

    res.status(201).json({
        status: true,
        message: "Notification created successfully",
        notification: result.notification
    });
});

/**
 * Admin: Send notification to all active customers
 */
export const sendNotificationToAll = catchAsync(async (req, res) => {
    const { title, body, type, data } = req.body;

    const customers = await Customer.find({ status: "active" })
        .select("_id")
        .lean();

    if (customers.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No active customers found");
    }

    const customerIds = customers.map(c => c._id);

    const result = await createBulkNotifications(
        customerIds,
        title,
        body,
        type,
        data
    );

    if (!result.success) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, result.error);
    }

    res.status(201).json({
        status: true,
        message: `Notification created for ${result.count} customers`,
        count: result.count
    });
});
