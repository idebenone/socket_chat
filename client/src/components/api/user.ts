import axios, { AxiosResponse } from "axios";
import { getToken } from "./auth";

const getHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'x-access-token': token.toString()
    };
};

export const getProfileApi = async (id: string): Promise<AxiosResponse> => {
    return await axios.get(`/api/user/profile/${id}`, { headers: getHeaders() });
}

export const followUserApi = async (id: string): Promise<AxiosResponse> => {
    return await axios.get(`/api/user/follow/${id}`, { headers: getHeaders() });
}

export const unFollowUserApi = async (id: string): Promise<AxiosResponse> => {
    return await axios.get(`/api/user/unfollow/${id}`, { headers: getHeaders() });
}

export const searchUserApi = async (query: string): Promise<AxiosResponse> => {
    return await axios.get(`/api/user/search?query=${query}`, { headers: getHeaders() });
}

export const getRecentConversations = async (): Promise<AxiosResponse> => {
    return await axios.get(`/api/user/recents`, { headers: getHeaders() });
}