import api from './axios';
import type { Partner, PartnerCondition } from '../types/partner';

export const partnerApi = {
  getAll: () =>
    api.get<Partner[]>('/partners/all').then((r) => r.data),

  getOne: (id: string) =>
    api.get<Partner>(`/partners/${id}`).then((r) => r.data),

  create: (formData: FormData) =>
    api.post<Partner>('/partners', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  update: (id: string, formData: FormData) =>
    api.patch<Partner>(`/partners/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`/partners/${id}`).then((r) => r.data),

  toggleVisibility: (id: string) =>
    api.patch<Partner>(`/partners/${id}/visibility`).then((r) => r.data),

  reorder: (items: { id: string; order: number }[]) =>
    api.patch('/partners/reorder', { items }).then((r) => r.data),

  // Conditions
  createCondition: (partnerId: string, data: { name_ru: string; name_uz?: string }) =>
    api.post<PartnerCondition>(`/partners/${partnerId}/conditions`, data).then((r) => r.data),

  updateCondition: (conditionId: string, data: { name_ru?: string; name_uz?: string }) =>
    api.patch<PartnerCondition>(`/partners/conditions/${conditionId}`, data).then((r) => r.data),

  removeCondition: (conditionId: string) =>
    api.delete(`/partners/conditions/${conditionId}`).then((r) => r.data),
};
