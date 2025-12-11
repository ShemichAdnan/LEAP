import {api} from './api';

export interface Ad {
    id: string;
    userId: string;
    type: 'tutor' | 'student';
    subject: string;
    areas: string[];
    level: string;
    pricePerHour?: number;
    location: string;
    city?: string;
    description: string;
    availableTimes?: string[];
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        avatarUrl?: string;
        city?: string;
        experience?: number;
        bio?: string;
    };
}

export interface CreateAdData {
    type: 'tutor' | 'student';
    subject: string;
    areas: string[];
    level: string;
    pricePerHour?: number;
    location: string;
    city?: string;
    description: string;
    availableTimes?: string[];
}

export interface AdFilters {
    type?: 'tutor' | 'student';
    subject?: string;
    level?: string;
    location?: string;
    city?: string;
};

export const getAds = async (filters?: AdFilters): Promise<Ad[]> => {
    const response = await api.get('/ads', { params: filters });
    return response.data.ads;
};

export const getAdById = async (id: string): Promise<Ad> => {
    const response = await api.get(`/ads/${id}`);
    return response.data.ad;
}

export const getMyAds = async (): Promise<Ad[]> => {
    const response = await api.get('/ads/me');
    return response.data.ads;
}

export const createAd = async (adData: CreateAdData): Promise<Ad> => {
    const response = await api.post('/ads', adData);
    return response.data.ad;
};

export const updateAd = async (id: string, updateData: Partial<CreateAdData>): Promise<Ad> => {
    const response = await api.put(`/ads/${id}`, updateData);
    return response.data.ad;
}
export const deleteAd = async (id: string): Promise<void> => {
    await api.delete(`/ads/${id}`);
}
export const searchAds = async (query: string): Promise<Ad[]> => {
    const response = await api.get('/ads/search', { params: { q: query } });
    return response.data.ads;
}