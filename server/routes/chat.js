import express from 'express';
import { addMembers, deleteChat, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMembers, renameGroup, sendAttachments } from '../controllers/chat.js';
import { addMembersValidator, chatIdValidators, leaveGroupValidator, newGroupChatValidator, removeMembersValidator, renameValidator, sendAttachmentsValidator, validateHandler } from '../lib/validators.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { checkAttachments } from '../middlewares/checkAttachments.js';
import { attachmentsMulter } from '../middlewares/multer.js';

const app = express.Router()

//Afer here user must be logged in to access the routes

app.use(isAuthenticated)

app.post('/new', newGroupChatValidator(), validateHandler, newGroupChat)

app.get('/my', getMyChats)

app.get('/my/groups', getMyGroups)

app.put('/addmembers', addMembersValidator(), validateHandler, addMembers)

app.put('/removemember', removeMembersValidator(), validateHandler, removeMembers)

app.delete('/leave/:id', leaveGroupValidator(), validateHandler, leaveGroup)

//Send Attachments
app.post('/message', attachmentsMulter, checkAttachments, sendAttachmentsValidator(), validateHandler, sendAttachments)

//Get Messages
app.get('/message/:id', chatIdValidators(), validateHandler, getMessages)

//Get Chat Details, rename, delete
app.route('/:id')
    .get(chatIdValidators(), validateHandler, getChatDetails)
    .put(renameValidator(), validateHandler, renameGroup)
    .delete(chatIdValidators(), validateHandler, deleteChat)

export default app;