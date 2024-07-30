import {  configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'

// Create a Redux store holding the state of the app.

export const store =configureStore({
    reducer:{
        user: userReducer,
    },
})
