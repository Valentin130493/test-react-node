import {configureStore} from "@reduxjs/toolkit"
import postSlice from "./slices/postSlice";
import authSlice from "./slices/authSlice";

const store = configureStore({
    reducer: {
        posts: postSlice,
        auth: authSlice,
    }
})

export default store