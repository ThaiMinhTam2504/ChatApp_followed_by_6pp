import multer from 'multer'


const multerUpload = multer({
    limits: {
        fileSize: 1024 * 1024 * 5
    }
})

const singleAvatar = multerUpload.single('avatar')

const attachmentsMulter = multerUpload.array('files') //max 5 files, check in checkAttachments.js

export { singleAvatar, attachmentsMulter }