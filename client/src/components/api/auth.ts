import axios, { AxiosResponse } from "axios";

export const loginApi = async (data: any): Promise<AxiosResponse> => {
    const response = await axios.post("http://localhost:3001/auth/login", data);
    return response;
}