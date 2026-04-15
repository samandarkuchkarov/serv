import api from './axios';
import type { Service } from '../types/service';

export const serviceApi = {
  getAll: () =>
    api.get<Service[]>('/services/all').then((r) => r.data),

  getOne: (id: string) =>
    api.get<Service>(`/services/${id}`).then((r) => r.data),

  create: (formData: FormData) =>
    api.post<Service>('/services', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  update: (id: string, formData: FormData) =>
    api.patch<Service>(`/services/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`/services/${id}`).then((r) => r.data),

  toggleVisibility: (id: string) =>
    api.patch<Service>(`/services/${id}/visibility`).then((r) => r.data),

  reorder: (items: { id: string; order: number }[]) =>
    api.patch('/services/reorder', { items }).then((r) => r.data),
};
