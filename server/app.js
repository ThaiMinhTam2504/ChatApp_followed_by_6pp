import express from 'express'
import { connectDb } from './utils/features.js'
import dotenv from 'dotenv'
import { errorMiddleware } from './middlewares/error.js'
import cookieParser from 'cookie-parser'

import userRoute from './routes/user.js'
import chatRoute from './routes/chat.js'
import adminRoute from './routes/admin.js'
import { createUser } from './seeders/user.js'
import { createGroupChats, createMessages, createMessagesInAChat, createSingleChats } from './seeders/chat.js'


dotenv.config({
    path: './.env'
})
const mongoURL = process.env.MONGO_URL
const port = 3000 || process.env.PORT
connectDb(mongoURL)

// createUser(10)
// createSingleChats(2)
// createGroupChats(2)
// createMessagesInAChat('68c97d42460cbcaaa54c7c99', 12)



const app = express()

//Using middlewares
app.use(express.json())
app.use(cookieParser())



app.use('/user', userRoute)
app.use('/chat', chatRoute)
app.use('/admin', adminRoute)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(errorMiddleware)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})