import api from './axios';
import type { Vacancy, VacancyCondition, VacancyRequirement } from '../types/vacancy';

export const vacancyApi = {
  getAll: () =>
    api.get<Vacancy[]>('/vacancies/all').then((r) => r.data),

  create: (data: object) =>
    api.post<Vacancy>('/vacancies', data).then((r) => r.data),

  update: (id: string, data: object) =>
    api.patch<Vacancy>(`/vacancies/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`/vacancies/${id}`).then((r) => r.data),

  toggleVisibility: (id: string) =>
    api.patch<Vacancy>(`/vacancies/${id}/visibility`).then((r) => r.data),

  // ─── Conditions ───────────────────────────────────────────────────────────

  createCondition: (vacancyId: string, data: { condition_name_ru: string; condition_name_uz?: string }) =>
    api.post<VacancyCondition>(`/vacancies/${vacancyId}/conditions`, data).then((r) => r.data),

  updateCondition: (conditionId: string, data: object) =>
    api.patch<VacancyCondition>(`/vacancies/conditions/${conditionId}`, data).then((r) => r.data),

  removeCondition: (conditionId: string) =>
    api.delete(`/vacancies/conditions/${conditionId}`).then((r) => r.data),

  // ─── Requirements ─────────────────────────────────────────────────────────

  createRequirement: (vacancyId: string, data: { name_ru: string; name_uz?: string }) =>
    api.post<VacancyRequirement>(`/vacancies/${vacancyId}/requirements`, data).then((r) => r.data),

  updateRequirement: (requirementId: string, data: object) =>
    api.patch<VacancyRequirement>(`/vacancies/requirements/${requirementId}`, data).then((r) => r.data),

  removeRequirement: (requirementId: string) =>
    api.delete(`/vacancies/requirements/${requirementId}`).then((r) => r.data),
};
