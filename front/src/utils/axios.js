import Axios from "axios"
import {baseURL} from "../constants/api";
import {TOKEN} from "../constants/storage";

const instance = Axios.create({
    baseURL: baseURL
})

instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem(TOKEN)
    return config
})

export default instance