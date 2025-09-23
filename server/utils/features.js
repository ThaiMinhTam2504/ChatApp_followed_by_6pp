import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import cloudinary from "cloudinary"
import { v4 as uuid } from 'uuid'

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

const uploadFilesToCloudinary = async (files = []) => {

    // tạo ra mảng các promise, trạng thái pending cho từng ảnh trong mảng và các ảnh phía sau sẽ không cần đợi ảnh phía trước pending xong thì mới chạy, nó sẽ chạy luôn
    // và kết quả trạng thái mới của từng pending sẽ được quyết định dựa vào callback trong cloudinary
    //nếu thành công thì resolve, thất bại thì reject
    //và đặt mảng uploadPromises vào Promise.all sẽ chỉ chờ tất cả các promise trong mảng này resolve hoặc reject [chạy song song]
    //còn nếu là await từng cái một thì sẽ phải chờ cái này xong mới đến cái kia [chạy tuần tự]
    //và trường hợp allSettled thì dễ tính hơn trả về trạng thái cho các promise trạng thái resolve và reject nó đều trả về
    const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload(file.path, {
                resource_type: 'auto', public_id: uuid()
            }, (error, result) => {
                if (error) return reject(error)
                resolve(result)
            })
        })
    })
}

const deleteFilesFromCloudinary = async (public_ids) => {

}

export { connectDb, sendToken, cookieOptions, emitEvent, deleteFilesFromCloudinary, uploadFilesToCloudinary }