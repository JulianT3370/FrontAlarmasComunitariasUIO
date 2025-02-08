import axios from "axios"

export const axiosApi = axios.create({
    baseURL: "http://192.168.0.102:5000"
})