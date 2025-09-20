import { envMode } from "../app.js"

const errorMiddleware = (err, req, res, next) => {

    err.message ||= "Internal Server Error"
    err.statusCode ||= 500


    // console.log(err)
    if (err.code === 11000) {
        const error = Object.keys(err.keyValue).join(', ')
        err.message = `this field: -->{ ${error} } already exists`
        err.statusCode = 400
    }

    if (err.name === 'CastError') {
        err.message = `Resource not found. Invalid: ${err.path}`
        err.statusCode = 400
    }
    // console.log(process.env.NODE_ENV === 'DEVELOPMENT');
    return res.status(err.statusCode).json({
        success: false,
        message: envMode === 'DEVELOPMENT' ? err.message + ' {devmode}' : err.message + '. Please contact with admin.',
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