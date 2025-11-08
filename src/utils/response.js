export const apiSuccess = (res, data = {}, message = "OK", status = 200) => {
    return res.status(status).json({
        status: true,
        message,
        data
    });
};
