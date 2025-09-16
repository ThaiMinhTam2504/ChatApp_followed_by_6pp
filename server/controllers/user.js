import { compare } from 'bcrypt'
import { User } from '../models/user.js'
import { cookieOptions, sendToken } from '../utils/features.js'
import { TryCatch } from '../middlewares/error.js'
import { ErrorHandler } from '../utils/utility.js'


//Create a new user and save it to the database and save token in cookies
const newUser = async (req, res) => {

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

}

//Login user and send token in cookies
const login = TryCatch(async (req, res, next) => {

    const { username, password } = req.body

    const user = await User.findOne({ username }).select('+password') // +password to get the password field which is set to select: false in the model

    if (!user) return next(new ErrorHandler("Invalid Credentials", 404))


    const isMatch = await compare(password, user.password)

    if (!isMatch) return next(new ErrorHandler("Invalid Credentials", 404))

    sendToken(res, user, 200, `Welcome back, ${user.name}`)

})



const getMyProfile = TryCatch(async (req, res) => {

    const user = await User.findById(req.user).select('-password ')

    res.status(200).json({
        success: true,
        user
    })
})


const logout = TryCatch(async (req, res) => {
    return res.status(200).cookie('chat-app-token', '', { ...cookieOptions, maxAge: 0 }).json({
        success: true,
        message: 'Logged out successfully'
    })
})


const searchUser = TryCatch(async (req, res) => {

    const { name } = req.query

    return res.status(200).json({
        success: true,
        message: `This is a dummy search endpoint. You searched for ${name}`
    })

})

export { newUser, login, getMyProfile, logout, searchUser }

