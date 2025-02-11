import axios from "axios"

export const axiosApi = axios.create({
    baseURL: "http://192.168.18.9:5000"
})