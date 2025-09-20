import { body, validationResult, param, query } from 'express-validator'
import { ErrorHandler } from '../utils/utility.js'


// Validation rules
const registerValidator = () => [
    body('name', 'Please enter a name').notEmpty(),
    body('username', 'Please enter a username').notEmpty(),
    body('password', 'Please enter a password').notEmpty(),
    body('bio', 'Please enter a bio').notEmpty(),
]

const loginValidator = () => [
    body('username', 'Please enter a username').notEmpty(),
    body('password', 'Please enter a password').notEmpty(),
]

const newGroupChatValidator = () => [
    body('name', 'Please enter a group name').notEmpty(),
    // body('members').isEmpty().withMessage("Please add at least 2 members").isArray({ min: 2, max: 100 }).withMessage("Members must be an array with at least 2 members and at most 100 members"),
    body('members').custom((value) => {
        if (!Array.isArray(value)) {
            throw new ErrorHandler("Members must be an array", 400)
        }
        if (value.length < 2) {
            throw new ErrorHandler("At least 2 members are required to form a group chat", 400)
        }
        if (value.length > 100) {
            throw new ErrorHandler("At most 100 members are allowed in a group chat", 400)
        }
        return true;
    })
]

const addMembersValidator = () => [
    body('chatId', 'Please enter a chat ID').notEmpty(),
    body('members').custom((value) => {
        if (!Array.isArray(value)) {
            throw new ErrorHandler("Members must be an array", 400)
        }
        if (value.length < 1) {
            throw new ErrorHandler("You need to select at least 1 member to add to the chat.", 400)
        }
        if (value.length > 100) {
            throw new ErrorHandler("You can add up to 100 members to the chat. You might select the amount of members over the group's capacity", 400)
        }
        return true;
    })
]

const removeMembersValidator = () => [
    body('chatId', 'Please enter a chat ID').notEmpty(),
    body('userId', 'Please enter a user ID').notEmpty()
]

const leaveGroupValidator = () => [
    param('id', 'Please enter a chat ID').notEmpty(

    )
]

const sendAttachmentsValidator = () => [
    body('chatId', 'Please enter a chat ID').notEmpty(),
]

const chatIdValidators = () => [
    param('id', 'Please enter a chat ID').notEmpty(),
]

const renameValidator = () => [
    param('id', 'Please enter a chat ID').notEmpty(),
    body('name', 'Please enter a new group name').notEmpty()
]

const sendRequestValidator = () => [
    body('userId', 'Please enter a user ID').notEmpty()
]

const acceptRequestValidator = () => [
    body('requestId', 'Please enter a requestID').notEmpty(),
    body('accept').notEmpty().withMessage('Please specify whether to accept or reject the request').isBoolean().withMessage('Accept must be a boolean value')
]

const adminLoginValidator = () => [
    body('secretKey', 'Please provide a secret key').notEmpty()
]







// Middleware to handle validation results
const validateHandler = (req, res, next) => {

    const errors = validationResult(req)

    const errorMessages = errors.array().map((error) => error.msg).join(', ')
    // console.log(errorMessages)

    if (errors.isEmpty()) {
        return next()
    } else {
        return next(new ErrorHandler(errorMessages, 400))
    }
}


export {
    registerValidator,
    loginValidator,
    validateHandler,
    newGroupChatValidator,
    addMembersValidator,
    removeMembersValidator,
    leaveGroupValidator,
    sendAttachmentsValidator,
    chatIdValidators,
    renameValidator,
    sendRequestValidator,
    acceptRequestValidator,
    adminLoginValidator
}