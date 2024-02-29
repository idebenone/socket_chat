import axios, { AxiosResponse } from "axios";
import { getToken } from "./auth";

const headers = {
    'Content-Type': 'application/json',
    'x-access-token': getToken().toString()
}

export const getMessageApi = async (data: { senderId: string, receiverId: string }): Promise<AxiosResponse> => {
    return await axios.get(`/api/message/${data.senderId}/${data.receiverId}`, { headers });
}