import { TryCatch } from "../middlewares/error.js";
import jwt from "jsonwebtoken";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { ErrorHandler } from "../utils/utility.js";
import { cookieOptions } from '../utils/features.js'

const adminLogin = TryCatch(async (req, res, next) => {
    const { secretKey } = req.body

    const adminSecretKey = process.env.ADMIN_SECRET_KEY || 'koregajiyuda'
    const isMatch = secretKey === adminSecretKey

    if (!isMatch) return next(new ErrorHandler('Invalid secret key', 401))

    const token = jwt.sign(secretKey, process.env.JWT_SECRET)

    return res.status(200).cookie('adminToken', token, {
        ...cookieOptions,
        maxAge: 1000 * 60 * 60 * 72 // 3 days
    }).json({
        success: true,
        message: 'Admin login successful, welcome boss'
    })
})

const adminLogout = TryCatch(async (req, res, next) => {

    return res.status(200).cookie('adminToken', '', {
        ...cookieOptions,
        maxAge: 0,
    }).json({
        success: true,
        message: 'Logged out successful, see you next time'
    })
})

const getAdminData = TryCatch(async (req, res, next) => {
    return res.status(200).json({
        admin: true,
    })
})


const allUsers = TryCatch(async (req, res, next) => {

    const users = await User.find({})

    const transformedUsers = await Promise.all(users.map(async ({ name, username, avatar, _id }) => {

        const [groups, friends] = await Promise.all([
            Chat.countDocuments({ groupChat: true, members: _id }),
            Chat.countDocuments({ groupChat: false, members: _id })
        ])

        return {
            name,
            username,
            avatar: avatar.url,
            _id,
            groups,
            friends
        }
    })
    )

    return res.status(200).json({
        status: 'success',
        transformedUsers
    })
})

const allChats = TryCatch(async (req, res, next) => {
    const chats = await Chat.find({}).populate('members', 'name username avatar').populate('creator', 'name avatar')

    const transformedChats = await Promise.all(
        chats.map(async ({ members, _id, groupChat, name, creator }) => {

            const totalMessages = await Message.countDocuments({ chat: _id });

            return {
                _id,
                groupChat,
                name,
                avatar: members.slice(0, 3).map((member) => member.avatar.url),
                members: members.map(({ _id, name, avatar }) => ({
                    _id,
                    name,
                    avatar: avatar.url
                })),
                creator: {
                    name: creator?.name || 'Unknown',
                    avatar: creator?.avatar.url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                },
                totalMembers: members.length,
                totalMessages
            }
        }))


    return res.status(200).json({
        status: 'success',
        chats
    })
})


const allMessages = TryCatch(async (req, res, next) => {
    const messages = await Message.find({}).populate('sender', 'name avatar').populate('chat', 'groupChat name')

    const totalMessages = messages.length;

    const transformedMessages = messages.map(({ content, attachments, _id, sender, createdAt, chat }) => ({
        _id,
        content,
        attachments,
        createdAt,
        chat: chat._id,
        groupChat: chat.groupChat,
        sender: {
            _id: sender._id,
            name: sender.name,
            avatar: sender.avatar.url
        }
    }))

    return res.status(200).json({
        success: true,
        totalMessages,
        transformedMessages
    })
})


const getDashboardStats = TryCatch(async (req, res, next) => {

    const [groupsCount, usersCount, messagesCount, totalChatsCount] = await Promise.all([
        Chat.countDocuments({ groupChat: true }),
        User.countDocuments({}),
        Message.countDocuments({}),
        Chat.countDocuments({})
    ])

    const today = new Date()

    const last7Days = new Date()
    last7Days.setDate(last7Days.getDate() - 7)

    const last7DaysMessages = await Message.find({
        createdAt: {
            $gte: last7Days,
            $lte: today
        }
    }).select('createdAt')

    const messages = new Array(7).fill(0)
    const dayInMiliseconds = 1000 * 60 * 60 * 24

    last7DaysMessages.forEach(message => {
        const indexApprox = (today.getTime() - message.createdAt.getTime()) / dayInMiliseconds
        const index = Math.floor(indexApprox)
        // messages[6 - index] += 1
        // messages[6 - index] = messages[6 - index] + 1
        messages[6 - index]++
    })

    const stats = {
        groupsCount,
        usersCount,
        messagesCount,
        totalChatsCount,
        messagesChart: messages
    }


    return res.status(200).json({
        result: 'success',
        stats
    })
})
export {
    allUsers,
    allChats,
    allMessages,
    getDashboardStats,
    adminLogin,
    adminLogout,
    getAdminData,
}