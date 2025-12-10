import {prisma} from '../utils/prisma.js';

export interface CreateAdData{
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
}

export const createAd = async(data: CreateAdData) => {
    return prisma.ad.create({
        data: {
            userId: data.userId,
            type: data.type,
            subject: data.subject,
            areas: data.areas,
            level: data.level,
            pricePerHour: data.pricePerHour,
            location: data.location,
            city: data.city,
            description: data.description,
            availableTimes: data.availableTimes,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                    city: true,
                    experience: true,
                },
            },
        },
    });
};

export const findAds = async(filters?: {
    type?: 'tutor' | 'student'; 
    subject?: string;
    level?: string;
    location?: string;
    city?: string;
}) => {
    return prisma.ad.findMany({
        where: filters,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                    city: true,
                    experience: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },    
    });
};

export const findAdById = async(id: string) => {
    return prisma.ad.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                    city: true,
                    experience: true,
                    bio: true,
                },
            },
        },
    });
}

export const findAdsByUserId=async(userId: string) => {
    return prisma.ad.findMany({
        where: { userId },
        orderBy:{   
            createdAt: 'desc',
        },
    });
}

export const updateAd=async(id:string,data:Partial<CreateAdData>)=>{
    return prisma.ad.update({
        where: { id },
        data,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                },
            },
        },
    });
}

export const deleteAd=async(id:string)=>{
    return prisma.ad.delete({
        where: { id },
    });
}
            