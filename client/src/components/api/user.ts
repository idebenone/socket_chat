import axios, { AxiosResponse } from "axios";
import { getToken } from "./auth";

const headers = {
    'Content-Type': 'application/json',
    'x-access-token': getToken().toString()
}

export const getProfileApi = async (id: string): Promise<AxiosResponse> => {
    return await axios.get(`/api/user/profile/${id}`, { headers });
}

export const followUserApi = async (id: string): Promise<AxiosResponse> => {
    return await axios.get(`/api/user/follow/${id}`, { headers });
}

export const unFollowUserApi = async (id: string): Promise<AxiosResponse> => {
    return await axios.get(`/api/user/unfollow/${id}`, { headers });
}

export const searchUserApi = async (query: string): Promise<AxiosResponse> => {
    return await axios.get(`/api/user/search?query=${query}`, { headers });
}

export const getRecentConversations = async (): Promise<AxiosResponse> => {
    return await axios.get(`/api/user/recents`, { headers });
}