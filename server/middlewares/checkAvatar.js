const checkAvatar = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Please upload an avatar" })
    }
    next();
}

export { checkAvatar }