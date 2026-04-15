import api from './axios';
import type { Banner } from '../types/banner';

export const bannersApi = {
  getAll: () =>
    api.get<Banner[]>('/banners/all').then((r) => r.data),

  create: (formData: FormData) =>
    api.post<Banner>('/banners', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  update: (id: string, formData: FormData) =>
    api.patch<Banner>(`/banners/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  toggleVisibility: (id: string) =>
    api.patch<Banner>(`/banners/${id}/visibility`).then((r) => r.data),

  reorder: (ids: string[]) =>
    api.patch<Banner[]>('/banners/reorder', { ids }).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`/banners/${id}`).then((r) => r.data),
};
