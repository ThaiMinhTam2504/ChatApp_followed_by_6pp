
const errorMiddleware = (err, req, res, next) => {

    err.message ||= "Internal Server Error"

    err.statusCode ||= 500

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    })
}


//Higher order function (HOF) to wrap async functions to catch errors
const TryCatch = (passedFunc) => async (req, res, next) => {
    try {
        await passedFunc(req, res, next)
    }
    catch (error) {
        next(error)
    }
}


export { errorMiddleware, TryCatch }