import mongoose from "mongoose"
import jwt from "jsonwebtoken"


const cookieOptions =
{
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: 'none',
    httpOnly: true,
    secure: true,
}


const connectDb = (url) => {
    mongoose.connect(url, { dbName: 'chat-app' }).then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host}`)
    }).catch((err) => {
        throw err
    })
}


const sendToken = (res, user, code, message) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)


    return res.status(code).cookie('chat-app-token', token, cookieOptions).json({
        message,
        success: true,
    });

};


const emitEvent = (req, event, user, data) => {
    console.log('Emmiting event', event)
}

const deleteFilesFromCloudinary = async (public_ids) => {

}

export { connectDb, sendToken, cookieOptions, emitEvent, deleteFilesFromCloudinary }