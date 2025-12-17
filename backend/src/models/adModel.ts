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
    const whereClause: any = {};
    
    if (filters?.type) {
        whereClause.type = filters.type;
    }
    
    if (filters?.level) {
        whereClause.level = filters.level;
    }
    
    
    if (filters?.location) {
        if (filters.location === 'online') {
            whereClause.location = { in: ['online', 'both'] };
        } else if (filters.location === 'in-person') {
            whereClause.location = { in: ['in-person', 'both'] };
        } else if (filters.location === 'both') {
            whereClause.location = 'both';
        }
    }

    const allAds=await prisma.ad.findMany({
        where: whereClause,
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

    let filteredAds=allAds;

    if(filters?.subject) {
        const subjectLower=filters.subject.toLowerCase();
        filteredAds=filteredAds.filter(ad=>ad.subject.toLowerCase().includes(subjectLower));
    }
    if(filters?.city) {
        const cityLower=filters.city.toLowerCase();
        filteredAds=filteredAds.filter(ad=>ad.city && ad.city.toLowerCase().includes(cityLower));
    }
    return filteredAds;
    
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
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                    bio: true,
                    subjects: true,
                    experience: true,
                    city: true,
                    pricePerHour: true,
                },
            },
        },
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

export const searchAds=async(query:string)=>{
    const lowerQuery=query.toLowerCase();

    const allAds=await prisma.ad.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                    city: true,
                    experience: true,
                }
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    }); 
    const filteredAds=allAds.filter(ad=>{
        if(ad.subject.toLowerCase().includes(lowerQuery)) return true;
        if(ad.location.toLowerCase().includes(lowerQuery)) return true;
        if(ad.city && ad.city.toLowerCase().includes(lowerQuery)) return true;
        if(ad.description.toLowerCase().includes(lowerQuery)) return true;
        if(ad.user.name.toLowerCase().includes(lowerQuery)) return true;
        if(Array.isArray(ad.areas)){
            const areasMatch=ad.areas.some((area)=>String(area).toLowerCase().includes(lowerQuery));
            if(areasMatch) return true;
    }
    if(ad.level.toLowerCase().includes(lowerQuery)) return true;
    
    return false;
    }
    );
    return filteredAds;
};