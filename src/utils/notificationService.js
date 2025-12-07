import Notification from "../models/Notification.js";

/**
 * Save notification to database only (no push notifications)
 * @param {String} customerId - Customer ID
 * @param {String} title - Notification title
 * @param {String} body - Notification body
 * @param {String} type - Notification type
 * @param {Object} data - Additional data
 * @returns {Object} Created notification
 */
export const createNotification = async (
    customerId,
    title,
    body,
    type = "general",
    data = {}
) => {
    try {
        const notification = await Notification.create({
            customer: customerId,
            title,
            body,
            data,
            type
        });

        return { success: true, notification };
    } catch (error) {
        console.error("Error creating notification:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Create notifications for multiple customers
 * @param {Array} customerIds - Array of customer IDs
 * @param {String} title - Notification title
 * @param {String} body - Notification body
 * @param {String} type - Notification type
 * @param {Object} data - Additional data
 * @returns {Object} Result
 */
export const createBulkNotifications = async (
    customerIds,
    title,
    body,
    type = "general",
    data = {}
) => {
    try {
        const notifications = customerIds.map(customerId => ({
            customer: customerId,
            title,
            body,
            data,
            type
        }));

        const savedNotifications = await Notification.insertMany(notifications);
        return { success: true, count: savedNotifications.length };
    } catch (error) {
        console.error("Error creating bulk notifications:", error);
        return { success: false, error: error.message };
    }
};

export default {
    createNotification,
    createBulkNotifications
};
