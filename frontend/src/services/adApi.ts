import {api} from './api';

import type { Ad } from '../App';

export interface CreateAdData {
    type: 'tutor' | 'student';
    subject: string;
    areas: string[];
    level: string;
    pricePerHour?: number;
    availableTimes?: string[];
    location: 'online' | 'in-person' | 'both';
    city?: string;
    description: string;
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

export const updateAd = async (id: string, updateData: Partial<Ad>): Promise<Ad> => {
    const response = await api.put(`/ads/${id}`, updateData);
    return response.data.ad;
}
export const deleteAd = async (id: string, currentPassword: string) => {
    const response = await api.delete(`/ads/${id}`,{
        data: {currentPassword}
    });
    await response.data;
}
export const searchAds = async (query: string): Promise<Ad[]> => {
    const response = await api.get('/ads/search', { params: { q: query } });
    return response.data.ads;
}