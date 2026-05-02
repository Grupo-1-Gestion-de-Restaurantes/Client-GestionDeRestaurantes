import axios from "axios";
import { useAuthStore } from "../../features/auth/store/useAuthStore";

export const axiosAuth = axios.create({
    baseURL: import.meta.env.VITE_AUTH_URL,
    timeout: 8000,
    headers: {
        "Content-Type": "application/json"
    }
})

const axiosAdmin = axios.create({
    baseURL: import.meta.env.VITE_ADMIN_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
})

export { axiosAdmin };