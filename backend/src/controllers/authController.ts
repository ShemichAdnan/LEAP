import { Request, Response } from 'express';
import { z } from 'zod';
import { authService } from '../services/authService.js';
import { setAuthCookies } from '../middlewares/auth.js';
import {
  RegisterDto,
  LoginDto,
  UpdateProfileDto,
  ChangePasswordDto,
} from '../validators/authValidators.js';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const dto = RegisterDto.parse(req.body);
      const user = await authService.register(dto);
      setAuthCookies(res, user);
      res.json({ user });
    } catch (e) {
      console.error(e);
      if (e instanceof z.ZodError) {
        const issues = e.issues ?? (e as any).errors ?? [];
        const first = issues[0];
        res.status(400).json({ message: first?.message ?? 'Invalid input' });
        return;
      }
      if ((e as Error).message === 'Email already exists') {
        res.status(409).json({ message: 'Email exists' });
        return;
      }
      res.status(400).json({ message: 'Invalid input' });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const dto = LoginDto.parse(req.body);
      const user = await authService.login(dto.email, dto.password);
      setAuthCookies(res, user);
      res.json({ user });
    } catch (e) {
      if ((e as Error).message === 'Invalid credentials') {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      res.status(400).json({ message: 'Invalid input' });
    }
  },

  async logout(_req: Request, res: Response) {
    res.clearCookie('accessToken', { httpOnly: true, sameSite: 'lax' });
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax' });
    res.json({ ok: true });
  },

  async getMe(req: Request, res: Response) {
    res.json({ user: (req as any).user });
  },

  async updateProfile(req: Request, res: Response) {
    try {
      const dto = UpdateProfileDto.parse(req.body);
      const userId = (req as any).user.id;
      const { currentPassword, ...data } = dto;

      const updated = await authService.updateProfile(userId, currentPassword, data);
      res.json({ user: updated });
    } catch (e) {
      console.error(e);
      if (e instanceof z.ZodError) {
        const issues = e.issues ?? (e as any).errors ?? [];
        const first = issues[0];
        res.status(400).json({ message: first?.message ?? 'Invalid input' });
        return;
      }
      if ((e as Error).message === 'User not found') {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      if ((e as Error).message === 'Current password is incorrect') {
        res.status(401).json({ message: 'Current password is incorrect' });
        return;
      }
      res.status(400).json({ message: 'Invalid input' });
    }
  },

  async uploadAvatar(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const file = req.file;

      if (!file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      const updated = await authService.uploadAvatar(userId, file);
      res.json({ user: updated });
    } catch (e) {
      console.error('Avatar upload error:', e);
      res.status(500).json({ message: 'Failed to upload avatar' });
    }
  },

  async changePassword(req: Request, res: Response) {
    try {
      const dto = ChangePasswordDto.parse(req.body);
      const userId = (req as any).user.id;

      await authService.changePassword(userId, dto.currentPassword, dto.newPassword);
      res.json({ message: 'Password updated successfully' });
    } catch (e) {
      console.error('Change password error:', e);
      if (e instanceof z.ZodError) {
        const issues = e.issues ?? (e as any).errors ?? [];
        const first = issues[0];
        res.status(400).json({ message: first?.message ?? 'Invalid input' });
        return;
      }
      if ((e as Error).message === 'User not found') {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      if ((e as Error).message === 'Current password is incorrect') {
        res.status(401).json({ message: 'Current password is incorrect' });
        return;
      }
      res.status(400).json({ message: 'Invalid input' });
    }
  },
};
