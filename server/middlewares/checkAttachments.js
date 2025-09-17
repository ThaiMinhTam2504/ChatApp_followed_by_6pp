
const checkAttachments = (req, res, next) => {
    // console.log('the process is running here')
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: "Please upload at least one attachment" })
    }
    if (req.files.length > 5) {
        return res.status(400).json({ success: false, message: "You can upload up to 5 attachments at a time" })
    }
    next()
}

export { checkAttachments }