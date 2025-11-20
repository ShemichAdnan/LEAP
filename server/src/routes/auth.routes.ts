import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma.js';
import { setAuthCookies, authGuard } from '../utils/auth.js';

const r = Router();

const RegisterDto = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
});

r.post('/register', async (req, res) => {
  try {
    const dto = RegisterDto.parse(req.body);
    const exists = await prisma.user.findUnique({ where: { email: dto.email }});
    if (exists) {
      res.status(409).json({ message: 'Email exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await prisma.user.create({
      data: { 
        email: dto.email, 
        name: dto.name, 
        passwordHash, 
        subjects: [] 
      }
    });

    setAuthCookies(res, user);
    res.json({ user: { id: user.id, email: user.email, name: user.name }});
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Invalid input' });
  }
});

const LoginDto = z.object({
  email: z.string().email(),
  password: z.string()
});

r.post('/login', async (req, res) => {
  try {
    const dto = LoginDto.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: dto.email }});
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    setAuthCookies(res, user);
    res.json({ user: { id: user.id, email: user.email, name: user.name }});
  } catch (e) {
    res.status(400).json({ message: 'Invalid input' });
  }
});

r.post('/logout', (_req, res) => {
  res.clearCookie('accessToken', { httpOnly: true, sameSite: 'lax' });
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax' });
  res.json({ ok: true });
});

r.get('/me', authGuard, async (req, res) => {
  res.json({ user: (req as any).user });
});

export default r;
