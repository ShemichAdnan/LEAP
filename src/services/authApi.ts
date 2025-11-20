import { api } from './api';
import type { User } from '../App';

export const login = async (data: { email: string; password: string }) => {
  const response = await api.post<{ user: User }>('/auth/login', data);
  return response.data.user;
};

export const register = async (data: { email: string; name: string; password: string }) => {
  const response = await api.post<{ user: User }>('/auth/register', data);
  return response.data.user;
};

export const logout = async () => {
  await api.post('/auth/logout');
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data.user;
  } catch {
    return null;
  }
};
