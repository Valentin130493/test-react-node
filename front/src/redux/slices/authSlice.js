import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import {login, me, register} from "../../constants/api";
import Axios from "../../utils/axios"
import {TOKEN} from "../../constants/storage";

export const fetchAuth = createAsyncThunk('auth/fetchUserData', async (params) => {
    const {data} = await Axios.post(`${login}`, params)
    return data
})

export const fetchAuthMe = createAsyncThunk('auth/fetchUserData', async () => {
    const {data} = await Axios.get(`${me}`)
    return data
})

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
    const {data} = await Axios.post(`${register}`, params)
    return data
})

const initialState = {
    user: null,
    status: 'loading'
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            window.localStorage.removeItem(TOKEN)
            state.user = null;
            state.status = "loaded";
        }
    },
    extraReducers: {
        [fetchAuth.pending]: (state) => {
            state.user = null;
            state.status = "loading"
        },
        [fetchAuth.fulfilled]: (state, action) => {
            state.user = action.payload;
            state.status = "loaded"
        },
        [fetchAuth.rejected]: (state) => {
            state.user = null;
            state.status = "error"
        },
        [fetchAuthMe.pending]: (state) => {
            state.user = null;
            state.status = "loading"
        },
        [fetchAuthMe.fulfilled]: (state, action) => {
            state.user = action.payload;
            state.status = "loaded"
        },
        [fetchAuthMe.rejected]: (state) => {
            state.user = null;
            state.status = "error"
        },
        [fetchRegister.pending]: (state) => {
            state.user = null;
            state.status = "loading"
        },
        [fetchRegister.fulfilled]: (state, action) => {
            state.user = action.payload;
            state.status = "loaded"
        },
        [fetchRegister.rejected]: (state) => {
            state.user = null;
            state.status = "error"
        },
    }
})

export const selectIsAuth = state => Boolean(state.auth.user)

export const {logout} = authSlice.actions;

export default authSlice.reducer