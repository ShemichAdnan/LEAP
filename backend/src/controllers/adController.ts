import type { Request, Response } from 'express';
import * as adService from '../services/adService.js';

export const createAd = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const adData=req.body;

    const newAd=await adService.createNewAd(userId, adData);

    res.status(201).json({
        message : 'Ad created successfully',
        ad: newAd,
    });
  } catch (err : any) {
    console.error('Create ad error:', err);
    res.status(400).json({ message: err.message || 'Failed to create ad' });
    }
};

export const getAds= async (req: Request, res: Response) => {
    try{
        const filters={
            type: req.query.type as 'tutor' | 'student' | undefined,
            subject: req.query.subject as string | undefined,
            level: req.query.level as string | undefined,
            location: req.query.location as string | undefined,
            city: req.query.city as string | undefined,
        };

        const ads=await adService.getAllAds(filters);

        res.json({ads});
    } catch (err : any) {
        console.error('Get ads error:', err);
        res.status(500).json({ message: err.message || 'Failed to fetch ads' });
    }
};

export const getAdById= async (req: Request, res: Response) => {
    try{
        const adId=req.params.id;
        const ad=await adService.getAdById(adId);

        res.json({ad});
    } catch (err : any) {
        console.error('Get ad by ID error:', err);
        res.status(404).json({ message: err.message || 'Ad not found' });
    }
};

export const getUserAds= async (req: Request, res: Response) => {
    try{
        const userId=(req as any).user.id;
        const ads=await adService.getUserAds(userId);
        res.json({ads});
    } catch (err : any) {
        console.error('Get user ads error:', err);
        res.status(500).json({ message: err.message || 'Failed to fetch user ads' });
    }
};

export const getAdsByUserId= async (req: Request, res: Response) => {
    try{
        const userId=req.params.userId;
        const ads=await adService.getUserAds(userId);
        res.json(ads);
    } catch (err : any) {
        console.error('Get ads by user ID error:', err);
        res.status(500).json({ message: err.message || 'Failed to fetch user ads' });
    }
};

export const updateAd= async (req: Request, res: Response) => {
    try{
        const adId=req.params.id;
        const userId=(req as any).user.id;
        const updateData=req.body;

        const updatedAd=await adService.updateUserAd(adId, userId, updateData);
        res.json({
            message: 'Ad updated successfully',
            ad: updatedAd,
        });
    } catch (err : any) {
        console.error('Update ad error:', err);
        res.status(400).json({ message: err.message || 'Failed to update ad' });
    }
};

export const deleteUserAd= async (req: Request, res: Response) => {
    try{
        const adId=req.params.id;
        const userId=(req as any).user.id;
        await adService.deleteUserAd(adId, userId);
        res.json({ message: 'Ad deleted successfully' });
    }
    catch (err : any) {
        console.error('Delete ad error:', err);
        res.status(400).json({ message: err.message || 'Failed to delete ad' });
    }
};

export const searchAds= async (req: Request, res: Response) => {
    try{
        const query=req.query.q as string;
        if(!query){
            res.status(400).json({ message: 'Search query is required' });
        }
        const ads=await adService.searchAllAds(query);
        res.json({ads});
    } catch (err : any) {
        console.error('Search ads error:', err);
        res.status(500).json({ message: err.message || 'Failed to search ads' });
    }
};

    
    