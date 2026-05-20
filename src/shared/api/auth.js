import { axiosAuth } from "./api";

export const login = async (data) => {
    return await axiosAuth.post("/auth/login", data);
}

export const getAllUsers = async () => {
    const { data } = await axiosAuth.get("/auth/users");
    return { users: data };
}

export const register = async (data) => {
    return await axiosAuth.post("/auth/register", data)
}

export const updateUserRole = async (userId, roleName) => {
    return await axiosAuth.put(`/users/${userId}/role`, { roleName })
}

export const verifyEmail = async (token) => {
    return await axiosAuth.post("/auth/verify-email", { token })
}

export const forgotPassword = async (email) => {
    return await axiosAuth.post("/auth/forgot-password", { email });
};

export const resetPassword = async (token, newPassword) => {
    return await axiosAuth.post("/auth/reset-password", { token, newPassword });
}

export const refreshToken = async (refreshToken) => {
    return await axiosAuth.post("/auth/refresh-token", { refreshToken });
}

export const updateProfile = async (formData) => {
    return await axiosAuth.post("/auth/update-profile", formData);
}

export const getProfile = async () => {
    return await axiosAuth.get("/auth/profile");
}
