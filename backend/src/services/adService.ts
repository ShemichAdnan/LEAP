import bcrypt from 'bcryptjs';
import * as adModel from '../models/adModel';
import type { CreateAdData } from '../models/adModel';
import { userModel } from '../models/userModel';

export const createNewAd = async (userId: string, adData: Omit<CreateAdData, 'userId'>) => {
    if(!adData.subject || adData.subject.trim().length === 0) {
        throw new Error('Subject is required');
    }

    if(!adData.description || adData.description.trim().length <20) {
        throw new Error('Description must be at least 20 characters long');
    }

    if(adData.areas.length === 0) {
        throw new Error('At least one area is required');
    }

    if(adData.type=='student'&& (!adData.pricePerHour || adData.pricePerHour <=0)) {
        throw new Error('Price per hour must be greater than 0 for student ads');
    }
    if((adData.location=='in-person' || adData.location=='both') && (!adData.city || adData.city.trim().length===0)) {
        throw new Error('City is required for in-person location');
    }

    return adModel.createAd({
        userId,
        ...adData
    });
};

export const getAllAds = async (filters?: {
    type?: 'tutor' | 'student'; 
    subject?: string;
    level?: string;
    location?: string;
    city?: string;
}) => {
    return adModel.findAds(filters);
};

export const getAdById = async (adId: string) => {
    const ad = await adModel.findAdById(adId);
    if(!ad) {
        throw new Error('Ad not found');
    }
    return ad;
};

export const getUserAds = async (userId: string) => {
    return adModel.findAdsByUserId(userId);
};

export const updateUserAd = async (adId: string, userId: string, updateData: Partial<Omit<CreateAdData, 'userId'>>) => {
    const existingAd = await adModel.findAdById(adId);
    if(!existingAd) {
        throw new Error('Ad not found');
    }

    if(existingAd.userId !== userId) {
        throw new Error('You do not have permission to update this ad');
    }

    if(updateData.description && updateData.description.trim().length <20) {
        throw new Error('Description must be at least 20 characters long');
    }
    
    if(updateData.areas && updateData.areas.length === 0) {
        throw new Error('At least one area is required');
    }

    return adModel.updateAd(adId, updateData);
};

export const deleteUserAd = async (adId: string, currentPassword: string) => {
    const existingAd = await adModel.findAdById(adId);
    const user = await userModel.findByIdWithPassword(existingAd?.userId || '');
    if(!existingAd) {
        throw new Error('Ad not found');
    }
    if(!user) {
        throw new Error('User not found');
    }
    if(!currentPassword) {
        throw new Error('Current password is required to delete the ad');
    }
    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if(!isValidPassword) {
        throw new Error('Current password is incorrect');
    }
    
    return adModel.deleteAd(adId);
}

export const searchAllAds = async (query: string) => {
    if(!query || query.trim().length === 0) {
        throw new Error('Query cannot be empty');
    }
    return adModel.searchAds(query.trim());
};