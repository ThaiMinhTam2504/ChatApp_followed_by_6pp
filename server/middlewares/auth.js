import { adminSecretKey } from "../app.js";
import { ErrorHandler } from "../utils/utility.js";
import jwt from 'jsonwebtoken'
import { TryCatch } from "./error.js";


const isAuthenticated = TryCatch((req, res, next) => {

    // console.log("Cookies: ", req.cookies["chat-app-token"]);

    const token = req.cookies["chat-app-token"]
    if (!token) return next(new ErrorHandler('Login first to access this resource', 401))
    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    // console.log('Decoded Token Data: ', decodedData);
    // const convertedIat = new Date(decodedData.iat * 1000).toLocaleString()
    // console.log('Converted IAT: ', convertedIat)


    //Create a req.user object and assign the user id to it
    req.user = decodedData._id
    next()
})


const adminOnly = (req, res, next) => {
    const token = req.cookies["adminToken"]
    if (!token) return next(new ErrorHandler('Only admins can access this resource', 401))


    const secretKey = jwt.verify(token, process.env.JWT_SECRET)

    const isMatch = secretKey === adminSecretKey
    if (!isMatch) return next(new ErrorHandler('Only admins can access this resource', 401))

    next()
}

export { isAuthenticated, adminOnly }