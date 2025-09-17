import express from 'express';
import { getMyProfile, login, logout, newUser, searchUser } from '../controllers/user.js';
import { singleAvatar } from '../middlewares/multer.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { loginValidator, registerValidator, validateHandler } from '../lib/validators.js';
import { checkAvatar } from '../middlewares/checkAvatar.js';

const app = express.Router()

app.post('/new', singleAvatar, checkAvatar, registerValidator(), validateHandler, newUser)
app.post('/login', loginValidator(), validateHandler, login)

//Afer here user must be logged in to access the routes

app.use(isAuthenticated)

app.get('/me', getMyProfile)

app.get('/logout', logout)

app.get('/search', searchUser)

export default app;