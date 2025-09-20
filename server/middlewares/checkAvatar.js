import { ErrorHandler } from "../utils/utility.js";

const checkAvatar = (req, res, next) => {
    if (!req.file) {
        return next(new ErrorHandler("Please provide an avatar", 400));
    }
    next();
}

export { checkAvatar }