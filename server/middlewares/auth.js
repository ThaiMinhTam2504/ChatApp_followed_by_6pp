import { ErrorHandler } from "../utils/utility.js";
import jwt from 'jsonwebtoken'


const isAuthenticated = (req, res, next) => {

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

}


export { isAuthenticated }