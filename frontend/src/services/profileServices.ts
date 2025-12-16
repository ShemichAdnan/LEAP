import { api } from "./api";
import type { User } from "../App";  


export const getAllProfiles = async (): Promise<User[]> => {
    const response = await api.get('/profiles');
    return response.data.profiles;
}

export const getProfileById = async (id: string): Promise<User> => {
    const response = await api.get(`/profiles/${id}`);
    return response.data;
}