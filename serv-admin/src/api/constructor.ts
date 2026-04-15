import api from './axios';
import type { Section, ConstructorItem } from '../types/constructor';

export const constructorApi = {
  // ─── Sections ─────────────────────────────────────────────────────────────

  getAll: () =>
    api.get<Section[]>('/constructor/all').then((r) => r.data),

  createSection: (data: { name: string }) =>
    api.post<Section>('/constructor/sections', data).then((r) => r.data),

  updateSection: (id: string, data: { name: string }) =>
    api.patch<Section>(`/constructor/sections/${id}`, data).then((r) => r.data),

  deleteSection: (id: string) =>
    api.delete(`/constructor/sections/${id}`).then((r) => r.data),

  // ─── Items ────────────────────────────────────────────────────────────────

  createItem: (sectionId: string, formData: FormData) =>
    api
      .post<ConstructorItem>(`/constructor/sections/${sectionId}/items`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  updateItem: (id: string, formData: FormData) =>
    api
      .patch<ConstructorItem>(`/constructor/items/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  deleteItem: (id: string) =>
    api.delete(`/constructor/items/${id}`).then((r) => r.data),

  toggleVisibility: (id: string) =>
    api.patch<ConstructorItem>(`/constructor/items/${id}/visibility`).then((r) => r.data),

  toggleArchive: (id: string) =>
    api.patch<ConstructorItem>(`/constructor/items/${id}/archive`).then((r) => r.data),
};
