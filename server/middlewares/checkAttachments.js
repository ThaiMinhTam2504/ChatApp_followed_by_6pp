import { ErrorHandler } from "../utils/utility.js"

const checkAttachments = (req, res, next) => {
    // console.log('the process is running here')
    if (!req.files || req.files.length === 0) {
        return next(new ErrorHandler("Please provide attachments", 400))
    }
    if (req.files.length > 5) {
        return next(new ErrorHandler("You can upload up to 5 attachments at a time", 400))
    }
    next()
}

export { checkAttachments }