import Customer from "../models/Customer.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import httpStatus from "http-status";

// Get all customers
export const getAllCustomers = catchAsync(async (req, res) => {
    const users = await Customer.find();
    res.json({ status: true, users });
});

// Suspend Customer
export const suspendCustomer = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await Customer.findByIdAndUpdate(id, { status: "suspended" }, { new: true });
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "Customer not found");
    res.json({ status: true, message: "User Suspended", user });
});

// Delete Customer
export const deleteCustomer = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await Customer.findByIdAndUpdate(id, { status: "deleted" }, { new: true });
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "Customer not found");
    res.json({ status: true, message: "User Deleted", user });
});


export const unsuspendCustomer = catchAsync(async (req, res) => {
    const updated = await Customer.findByIdAndUpdate(req.params.id, { status: "active" }, { new: true });
    res.json({ message: "Customer Unsuspended", customer: updated });
});
