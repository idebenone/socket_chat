import axios, { AxiosResponse } from "axios";

export const getToken = (): string => { return localStorage.getItem("token") || ""; }

export const setToken = (data: { token: string, id: string }) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("_id", data.id);
}

export const removeToken = (): void => { localStorage.removeItem("token"); }

export const getUserId = (): string => { return localStorage.getItem("_id") || "" }

export const loginApi = async (data: { username: string, password: string }): Promise<AxiosResponse> => {
    const response = await axios.post("/api/auth/login", data);
    return response;
}

export const registerApi = async (data: { email: string, name: string, username: string, password: string }): Promise<AxiosResponse> => {
    const response = await axios.post("/api/auth/register", data);
    return response;
}

export const verifyApi = async (data: { email: string, otp: string }) => {
    const response = await axios.post("/api/auth/verify", data);
    return response;
}

