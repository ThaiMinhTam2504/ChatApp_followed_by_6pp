import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/Chat.js";
import { Message } from '../models/message.js'
import { deleteFilesFromCloudinary, emitEvent } from "../utils/features.js";
import { ALERT, NEW_ATTACHMENT, NEW_MESSAGE_ALERT, REFETCH_CHATS } from '../constants/events.js'
import { getOtherMember } from "../lib/helper.js";
import { User } from "../models/user.js";


const newGroupChat = TryCatch(async (req, res, next) => {
    const { name, members } = req.body

    // if (members.length < 2) return next(new ErrorHandler("At least 2 members are required to form a group chat", 400))

    const allMembers = [...members, req.user]

    await Chat.create({
        name,
        groupChat: true,
        creator: req.user,
        members: allMembers
    })

    emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`)
    emitEvent(req, REFETCH_CHATS, members)

    return res.status(201).json({
        success: true,
        message: "Group chat created successfully"
    })
})


const getMyChats = TryCatch(async (req, res, next) => {

    const chats = await Chat.find({ members: req.user }).populate(
        "members",
        "name avatar"
    )

    const transformedChats = chats.map(({ _id, name, members, groupChat }) => {

        const otherMembers = getOtherMember(members, req.user)

        return {
            _id,
            groupChat,
            name: groupChat ? name : otherMembers.name,
            avatar: groupChat ? members.slice(0, 3).map(
                ({ avatar }) => avatar.url) : [otherMembers.avatar.url],
            members: members.reduce((prev, curr) => {
                if (curr._id.toString() !== req.user.toString()) {
                    prev.push(curr._id)
                }
                return prev
            }, []),
        }
    })


    return res.status(200).json({
        success: true,
        chats: transformedChats
    })
})


const getMyGroups = TryCatch(async (req, res, next) => {
    const chats = await Chat.find({
        members: req.user,
        groupChat: true,
        creator: req.user
    }).populate("members", "name avatar")

    const groups = chats.map(({ members, _id, groupChat, name }) => ({
        _id,
        groupChat,
        name,
        avatar: members.slice(0, 3).map(({ avatar }) => avatar.url)
    }))

    return res.status(200).json({
        success: true,
        groups
    })
})

const addMembers = TryCatch(async (req, res, next) => {

    const { chatId, members } = req.body

    // if (!members || members.length < 1) return next(new ErrorHandler('Please provide members to add', 400))

    const chat = await Chat.findById(chatId)
    if (!chat) return next(new ErrorHandler("Chat not found", 404))
    if (!chat.groupChat) return next(new ErrorHandler("You can only add members to group chat. This might be a private chat", 400))
    if (chat.creator.toString() !== req.user.toString()) {
        return next(new ErrorHandler("Only group admin can add members", 403))
    }

    const allNewMembersPromise = members.map(i => User.findById(i, "name"))
    // console.log('allNewMembersPromise:', allNewMembersPromise)

    const allNewMembers = await Promise.all(allNewMembersPromise)
    // console.log('allNewMembers:', allNewMembers)
    const uniqueMembers = allNewMembers.filter(i => !chat.members.includes(i._id.toString()))

    chat.members.push(...uniqueMembers)

    if (chat.members.length > 100) return next(new ErrorHandler("Group chat can have maximum 100 members", 400))

    await chat.save()

    const allUsersName = allNewMembers.map(i => i.name).join(',')

    emitEvent(req, ALERT, chat.members, `${allUsersName} has been added to the ${chat.name} group`)

    emitEvent(req, REFETCH_CHATS, chat.members)

    return res.status(200).json({
        success: true,
        message: "Members added successfully"
    })
})

const removeMembers = TryCatch(async (req, res, next) => {

    const { userId, chatId } = req.body

    console.log('userId:', userId)

    const [chat, userThatWillBeRemoved] = await Promise.all([
        Chat.findById(chatId),
        User.findById(userId, "name")
    ])

    if (!chat) return next(new ErrorHandler('Chat not found', 404))

    if (!chat.groupChat) return next(new ErrorHandler('You can only remove members from group chat', 400))

    if (chat.creator.toString() !== req.user.toString()) {
        return next(new ErrorHandler("Only group admin can remove members", 403))
    }

    if (chat.members.length <= 2) return next(new ErrorHandler("Group chat must have at least 2 members", 400))

    chat.members = chat.members.filter(member => member.toString() !== userId)

    await chat.save()
    emitEvent(req, ALERT, chat.members, `${userThatWillBeRemoved.name} has been removed from the ${chat.name} group`)
    emitEvent(req, REFETCH_CHATS, chat.members)

    return res.status(200).json({
        success: true,
        message: "Member removed successfully"
    })
})


const leaveGroup = TryCatch(async (req, res, next) => {

    const chatId = req.params.id
    const chat = await Chat.findById(chatId)
    if (!chat) return next(new ErrorHandler('Chat not found', 404))
    if (!chat.groupChat) return next(new ErrorHandler('You can only leave from group chat', 400))

    const remainingMembers = (chat.members.filter(member => member.toString() !== req.user.toString()))

    if (remainingMembers.length < 2) return next(new ErrorHandler("Group chat must have at least 2 members", 400))


    if (chat.creator.toString() === req.user.toString()) {
        const randomElement = Math.floor(Math.random() * remainingMembers.length)
        const newCreator = remainingMembers[randomElement]
        chat.creator = newCreator
    }

    chat.members = remainingMembers
    const [user] = await Promise.all([
        User.findById(req.user, "name"),
        await chat.save()
    ])

    emitEvent(req, ALERT, chat.members, `User ${user.name} has left the ${chat.name} group`)

    return res.status(200).json({
        success: true,
        message: "Left group successfully"
    })
})


const sendAttachments = TryCatch(async (req, res, next) => {

    const { chatId } = req.body
    const [chat, me] = await Promise.all([
        Chat.findById(chatId),
        User.findById(req.user, 'name avatar')
    ])
    //test logs
    // const idString = me._id.toString();
    // const meAfterString = { _id: idString, name: me.name };
    // console.log('chatId:', chatId)
    // console.log('me berfore string:', me)
    // console.log('me after string:', meAfterString)


    if (!chat) return next(new ErrorHandler("Chat not found", 404))


    const files = req.files || []
    // if (files.length < 1) return next(new ErrorHandler("Please provide attachments", 400))

    //Upload files here
    const attachments = []


    const messageForDb = {
        content: '',
        attachments,
        sender: me._id,
        chat: chatId
    }

    const messageForRealTime = {
        ...messageForDb,
        sender: {
            _id: me._id,
            name: me.name,
            avatar: me.avatar.url
        },
    }


    const message = await Message.create(messageForDb)

    emitEvent(req, NEW_ATTACHMENT, chat.members, {
        message: messageForRealTime,
        chatId
    })

    emitEvent(req, NEW_MESSAGE_ALERT, chat.members, {
        chatId
    })

    return res.status(200).json({
        success: true,
        message,
    })
})

const getChatDetails = TryCatch(async (req, res, next) => {

    if (req.query.populate === 'true') {

        const chat = await Chat.findById(req.params.id).populate('members', 'name avatar').lean()

        if (!chat) return next(new ErrorHandler("Chat not found", 404))

        chat.members = chat.members.map(({ _id, name, avatar }) => (
            {
                _id,
                name,
                avatar: avatar.url
            }
        ))

        return res.status(200).json({
            success: true,
            chat
        })

    } else {
        const chat = await Chat.findById(req.params.id)
        if (!chat) return next(new ErrorHandler("Chat not found", 404))

        return res.status(200).json({
            success: true,
            chat
        })

    }

})


const renameGroup = TryCatch(async (req, res, next) => {
    const chatId = req.params.id
    const { name } = req.body

    const chat = await Chat.findById(chatId)

    if (!chat) return next(new ErrorHandler("Chat not found", 404))
    if (!chat.groupChat) return next(new ErrorHandler("You can only rename group chat", 400))
    if (chat.creator.toString() !== req.user.toString()) {
        return next(new ErrorHandler("Only group admin can rename the group", 403))
    }

    chat.name = name
    await chat.save()

    emitEvent(req, REFETCH_CHATS, chat.members)

    return res.status(200).json({
        success: true,
        message: "Group renamed successfully"
    })
})

const deleteChat = TryCatch(async (req, res, next) => {
    const chatId = req.params.id
    const chat = await Chat.findById(chatId)
    if (!chat) return next(new ErrorHandler("Chat not found", 404))
    if (!chat.groupChat) return next(new ErrorHandler("You can only delete group chat", 400))
    if (chat.groupChat && chat.creator.toString() !== req.user.toString()) {
        return next(new ErrorHandler("Only group admin can delete the group", 403))
    }
    if (!chat.groupChat && !chat.members.includes(req.user.toString())) {
        return next(new ErrorHandler("You are not a member of this chat", 403))
    }
    const members = chat.members

    //Here we can also delete all messages associated with this chat inclueding attachments or files from cloudinary

    const messagesWithAttachments = await Message.find({
        chat: chatId,
        attachments: { $exists: true, $not: { $size: 0 } }
    })

    // console.log('messagesWithAttachments:', messagesWithAttachments)

    const public_ids = []


    // messagesWithAttachments.forEach((message) => {
    //     message.attachments.forEach((attachment) => {
    //         public_ids.push(attachment.public_id)
    //     })
    // })


    //or using destructuring
    messagesWithAttachments.forEach(({ attachments }) => {
        attachments.forEach(({ public_id }) => {
            public_ids.push(public_id)
        })
    })

    await Promise.all([
        //Delete files from cloudinary
        deleteFilesFromCloudinary(public_ids),
        chat.deleteOne(),
        Message.deleteMany({ chat: chatId }),
    ])
    emitEvent(req, REFETCH_CHATS, members)

    return res.status(200).json({
        success: true,
        message: "Chat deleted successfully"
    })

})


const getMessages = TryCatch(async (req, res, next) => {
    const chatId = req.params.id
    const { page = 1 } = req.query
    const resultPerPage = 20
    const skip = (page - 1) * resultPerPage



    //Test logs for destructuring
    // const array = [{ id: 1, name: 'a is object' }, 2, 'toi la String type', true, [1, 2, 3]]
    // const [a, b, c, d, e] = array
    // console.log('a:', a, 'b:', b, 'c:', c, 'd:', d, 'e:', e)


    const [messages, totalMessagesCount] = await Promise.all([
        Message.find({ chat: chatId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(resultPerPage)
            .populate('sender', 'name avatar')
            .lean(),
        Message.countDocuments({ chat: chatId })
    ])

    // console.log('messages:', messages)
    // console.log('totalMessagesCount:', totalMessagesCount)

    const totalPages = Math.ceil(totalMessagesCount / resultPerPage)

    return res.status(200).json({
        success: true,
        messages,
        totalPages
    })



})

export {
    newGroupChat,
    getMyChats,
    getMyGroups,
    addMembers,
    removeMembers,
    leaveGroup,
    sendAttachments,
    getChatDetails,
    renameGroup,
    deleteChat,
    getMessages
}