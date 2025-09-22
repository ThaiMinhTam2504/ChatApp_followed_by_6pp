import { configureStore } from "@reduxjs/toolkit"
import authSlice from '../redux/reducers/auth.js'


const store = configureStore({
    reducer: {
        [authSlice.name]: authSlice.reducer,
    },
})

// console.log('store', store)

export default store