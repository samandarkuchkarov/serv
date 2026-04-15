export interface VacancyCondition {
  id: string;
  condition_name_ru: string;
  condition_name_uz: string | null;
  created_at: string;
  updated_at: string;
}

export interface VacancyRequirement {
  id: string;
  name_ru: string;
  name_uz: string | null;
  created_at: string;
  updated_at: string;
}

export interface Vacancy {
  id: string;
  title_uz: string;
  title_ru: string;
  city: string;
  contact_phone: string;
  contact_name_ru: string | null;
  contact_name_uz: string | null;
  subtitle_ru: string | null;
  subtitle_uz: string | null;
  garant_ru: string | null;
  garant_uz: string | null;
  res_ru: string | null;
  res_uz: string | null;
  is_visible: boolean;
  conditions: VacancyCondition[];
  requirements: VacancyRequirement[];
  created_at: string;
  updated_at: string;
}
