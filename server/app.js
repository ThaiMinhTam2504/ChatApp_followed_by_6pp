import express from 'express'
import { connectDb } from './utils/features.js'
import dotenv from 'dotenv'
import { errorMiddleware } from './middlewares/error.js'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { v4 as uuid } from 'uuid'

import userRoute from './routes/user.js'
import chatRoute from './routes/chat.js'
import adminRoute from './routes/admin.js'
import { createUser } from './seeders/user.js'
import { createGroupChats, createMessages, createMessagesInAChat, createSingleChats } from './seeders/chat.js'
import { NEW_MESSAGE } from './constants/events.js'
import { getSockets } from './lib/helper.js'




dotenv.config({
    path: './.env'
})
const mongoURL = process.env.MONGO_URL
const port = 3000 || process.env.PORT
const envMode = process.env.NODE_ENV.trim() || 'PRODUCTION'
const adminSecretKey = process.env.ADMIN_SECRET_KEY || 'koregajiyuda'
const userSocketIDs = new Map()
connectDb(mongoURL)

// createUser(10)
// createSingleChats(2)
// createGroupChats(2)
// createMessagesInAChat('68c97d42460cbcaaa54c7c99', 12)



const app = express()
const server = createServer(app)
const io = new Server(server, {})

//Using middlewares
app.use(express.json())
app.use(cookieParser())



app.use('/user', userRoute)
app.use('/chat', chatRoute)
app.use('/admin', adminRoute)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

io.on('connection', (socket) => {
    const user = {
        _id: 'asdsadasd',
        name: 'Namgon'
    }
    userSocketIDs.set(user._id.toString(), socket.id)
    console.log(userSocketIDs);

    socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {

        const messageForRealTime = {
            content: message,
            _id: uuid(),
            sender: {
                _id: user._id,
                name: user.name
            },
            chatId: chatId,
            createdAt: new Date().toISOString()
        }

        const messageForDB = {
            content: message,
            sender: user._id,
            chat: chatId
        }

        const membersSocket = getSockets(members)

        console.log('New Message:', messageForRealTime);
    })

    socket.on('disconnect', () => {
        console.log('User Disconnected');
        userSocketIDs.delete(user._id.toString())
        console.log(userSocketIDs);
    })
})

app.use(errorMiddleware)


server.listen(port, () => {
    console.log(`Server is running on port ${port} in ${envMode} Mode.`)
})

export {
    envMode,
    adminSecretKey,
    userSocketIDs
}