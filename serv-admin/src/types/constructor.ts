export type PageType = 'internet' | 'fiz' | 'teh' | 'yur' | 'data' | 'iptv' | 'equipments' | 'other' | 'both';

export interface ConstructorItem {
  id: string;
  access_only_by_url: boolean;
  title_uz: string;
  title_ru: string;
  description_ru: string | null;
  description_uz: string | null;
  short_text_ru: string | null;
  short_text_uz: string | null;
  seo_ru: string | null;
  seo_uz: string | null;
  image: string | null;
  image_uz: string | null;
  is_visible: boolean;
  is_archived: boolean;
  page: PageType | null;
  cities: string[];
  section_id: string;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: string;
  name: string;
  items: ConstructorItem[];
  created_at: string;
  updated_at: string;
}
