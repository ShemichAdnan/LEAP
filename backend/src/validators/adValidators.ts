import {z} from 'zod';
import type { Request, Response, NextFunction } from 'express';

export const CreateAdDto = z.object({
    type: z.enum(['tutor', 'student'], {
        message: 'Type must be either tutor or student'
    }),
    subject: z.string().min(1, {
        message: 'Subject is required'
    }),
    areas: z
        .array(z.string())
        .min(1, { message: 'At least one area is required' })
        .max(10, { message: 'No more than 10 areas allowed' }),
    level: z.enum(['Elementary', 'High School', 'College' , 'Professional'], {
        message: 'Level must be one of Elementary, High School, College, Professional',
    }),
    pricePerHour: z.number().int().min(0).max(1000).optional(),
    location: z.enum(['online', 'in-person', 'both'], {
        message: 'Location must be one of online, in-person, both',
    }),     
    city: z.string().max(100).optional(),
    description: z.string().min(20, {
        message: 'Description must be at least 20 characters long'
    }),
    availableTimes: z.array(z.string()).optional(),
});

export const UpdateAdDto = CreateAdDto.partial();

export const validateCreateAd=(req: Request, res: Response, next: NextFunction) => {
    try{
        CreateAdDto.parse(req.body);
        next();
    }catch(e){
        if(e instanceof z.ZodError){
            const firstError = e.issues[0];
            res.status(400).json({message: firstError?.message || 'Invalid input'});
            return;
        }
    res.status(400).json({message: 'Invalid input'});
    }
};
  
export const validateUpdateAd=(req: Request, res: Response, next: NextFunction) => {
    try{
        UpdateAdDto.parse(req.body);
        next();
    }catch(e){
        if(e instanceof z.ZodError){
            const firstError = e.issues[0];
            res.status(400).json({message: firstError?.message || 'Invalid input'});
            return;
        }
        res.status(400).json({message: 'Invalid input'});
    }
};