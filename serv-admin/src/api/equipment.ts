import api from './axios';
import type { Equipment, MainChar } from '../types/equipment';

export const equipmentApi = {
  getAll: () =>
    api.get<Equipment[]>('/equipments/all').then((r) => r.data),

  create: (formData: FormData) =>
    api.post<Equipment>('/equipments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  update: (id: string, formData: FormData) =>
    api.patch<Equipment>(`/equipments/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`/equipments/${id}`).then((r) => r.data),

  toggleVisibility: (id: string) =>
    api.patch<Equipment>(`/equipments/${id}/visibility`).then((r) => r.data),

  // ─── MainChar ─────────────────────────────────────────────────────────────

  createChar: (equipmentId: string, data: { name_uz: string; name_ru: string }) =>
    api.post<MainChar>(`/equipments/${equipmentId}/chars`, data).then((r) => r.data),

  updateChar: (charId: string, data: { name_uz?: string; name_ru?: string }) =>
    api.patch<MainChar>(`/equipments/chars/${charId}`, data).then((r) => r.data),

  removeChar: (charId: string) =>
    api.delete(`/equipments/chars/${charId}`).then((r) => r.data),
};
