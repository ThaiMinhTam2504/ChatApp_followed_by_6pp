import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { addMembers, deleteChat, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMembers, renameGroup, sendAttachments } from '../controllers/chat.js';
import { attachmentsMulter } from '../middlewares/multer.js';
import { get } from 'mongoose';

const app = express.Router()

//Afer here user must be logged in to access the routes

app.use(isAuthenticated)

app.post('/new', newGroupChat)

app.get('/my', getMyChats)

app.get('/my/groups', getMyGroups)

app.put('/addmembers', addMembers)

app.put('/removemember', removeMembers)

app.delete('/leave/:id', leaveGroup)

//Send Attachments
app.post('/message', attachmentsMulter, sendAttachments)

//Get Messages
app.get('/message/:id', getMessages)

//Get Chat Details, rename, delete
app.route('/:id').get(getChatDetails).put(renameGroup).delete(deleteChat)

export default app;