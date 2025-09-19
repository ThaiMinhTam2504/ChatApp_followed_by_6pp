import { compare } from 'bcrypt'
import { User } from '../models/user.js'
import { Chat } from '../models/chat.js'
import { Request } from '../models/request.js'
import { cookieOptions, emitEvent, sendToken } from '../utils/features.js'
import { TryCatch } from '../middlewares/error.js'
import { ErrorHandler } from '../utils/utility.js'
import { NEW_REQUEST, REFETCH_CHATS } from '../constants/events.js'
import { getOtherMember } from '../lib/helper.js'


//Create a new user and save it to the database and save token in cookies
const newUser = TryCatch(async (req, res, next) => {

    const { name, username, password, bio } = req.body

    const avatar = {
        public_id: 'sample_id',
        url: 'sample_url'
    }

    const user = await User.create({
        name: name,
        bio: bio,
        username: username,
        password: password,
        avatar,
    })

    sendToken(res, user, 201, 'User created successfully')

})

//Login user and send token in cookies
const login = TryCatch(async (req, res, next) => {

    const { username, password } = req.body

    const user = await User.findOne({ username }).select('+password') // +password to get the password field which is set to select: false in the model

    if (!user) return next(new ErrorHandler("Invalid Credentials", 404))


    const isMatch = await compare(password, user.password)

    if (!isMatch) return next(new ErrorHandler("Invalid Credentials", 404))

    sendToken(res, user, 200, `Welcome back, ${user.name}`)

})



const getMyProfile = TryCatch(async (req, res, next) => {

    const user = await User.findById(req.user).select('-password ')
    if (!user) return next(new ErrorHandler("User not found", 404))

    res.status(200).json({
        success: true,
        user
    })
})


const logout = TryCatch(async (req, res, next) => {
    return res.status(200).cookie('chat-app-token', '', { ...cookieOptions, maxAge: 0 }).json({
        success: true,
        message: 'Logged out successfully'
    })
})


const searchUser = TryCatch(async (req, res, next) => {

    const { name = '' } = req.query


    //Find all my chats
    const myChats = await Chat.find({
        groupChat: false,
        members: req.user
    })

    //Extract all users from my chats means my friends or people I have chatted with
    const allUsersFromMyChats = myChats.map((chat) => chat.members).flat()


    //All users except me and my friends
    const allUsersExceptMeAndFriends = await User.find({
        _id: { $nin: allUsersFromMyChats },
        name: { $regex: name, $options: 'i' }
    })

    //Modify response
    const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
        _id,
        name,
        avatar: avatar.url
    }))

    return res.status(200).json({
        success: true,
        users
    })

})

const sendFriendRequest = TryCatch(async (req, res, next) => {
    const { userId } = req.body
    if (userId === req.user.toString()) return next(new ErrorHandler("You cannot send a friend request to yourself", 400))

    const request = await Request.findOne({
        $or: [
            { sender: req.user, receiver: userId },
            { sender: userId, receiver: req.user }
        ]
    })

    if (request) return next(new ErrorHandler("You have already sent a friend request to this user", 400))

    await Request.create({
        sender: req.user,
        receiver: userId
    })

    emitEvent(req, NEW_REQUEST, [userId])

    return res.status(200).json({
        success: true,
        message: 'Friend request sent successfully',
        // request: { _id: newRequest._id, sender: newRequest.sender, receiver: newRequest.receiver }
    })
})

const acceptFriendRequest = TryCatch(async (req, res, next) => {
    const { requestId, accept } = req.body

    const request = await Request.findById(requestId).populate('sender', 'name avatar').populate('receiver', 'name avatar')

    if (request.receiver._id.toString() !== req.user.toString()) return next(new ErrorHandler("You are not authorized to accept this request", 403))
    if (!request) return next(new ErrorHandler("Request not found", 404))

    if (!accept) {
        await request.deleteOne()

        return res.status(200).json({
            success: true,
            message: 'Friend request rejected successfully'
        })
    }

    const members = [request.sender._id, request.receiver._id]

    await Promise.all([
        Chat.create({ members, name: `${request.sender.name} - ${request.receiver.name}`, groupChat: false }),
        request.deleteOne()
    ])

    emitEvent(req, REFETCH_CHATS, members)

    return res.status(200).json({
        success: true,
        message: 'Friend request accepted successfully',
        senderId: request.sender._id
    })
})

const getMyNotifications = TryCatch(async (req, res, next) => {
    const requests = await Request.find({ receiver: req.user }).populate('sender', 'name avatar')

    // console.log(requests)

    const allRequests = requests.map(({ _id, sender }) => ({
        _id,
        sender: {
            _id: sender._id,
            name: sender.name,
            avatar: sender.avatar.url
        }
    }))

    // console.log('allRequests', allRequests)

    return res.status(200).json({
        success: true,
        allRequests
    })
})

const getMyFriends = TryCatch(async (req, res, next) => {

    const chatId = req.query.chatId

    const chats = await Chat.find({ members: req.user, groupChat: false }).populate('members', 'name avatar')

    const friends = chats.map(({ members }) => {
        const otherUser = getOtherMember(members, req.user)
        return {
            _id: otherUser._id,
            name: otherUser.name,
            avatar: otherUser.avatar.url
        }
    })

    if (chatId) {
        const chat = await Chat.findById(chatId)
        const availableFriends = friends.filter(
            (friend) => !chat.members.includes(friend._id)
        )
        return res.status(200).json({
            success: true,
            friends: availableFriends
        })
    } else {
        return res.status(200).json({
            success: true,
            friends
        })
    }
})

export {
    newUser,
    login,
    getMyProfile,
    logout,
    searchUser,
    sendFriendRequest,
    acceptFriendRequest,
    getMyNotifications,
    getMyFriends
}
