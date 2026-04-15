import api from './axios';
import type { Advantage } from '../types/advantage';

export const advantagesApi = {
  getAll: () =>
    api.get<Advantage[]>('/advantages/all').then((r) => r.data),

  create: (formData: FormData) =>
    api.post<Advantage>('/advantages', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  update: (id: string, formData: FormData) =>
    api.patch<Advantage>(`/advantages/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  toggleVisibility: (id: string) =>
    api.patch<Advantage>(`/advantages/${id}/visibility`).then((r) => r.data),

  reorder: (ids: string[]) =>
    api.patch<Advantage[]>('/advantages/reorder', { ids }).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`/advantages/${id}`).then((r) => r.data),
};
