export type PartnerType = 'joy' | 'beauty' | 'other' | 'education' | 'style' | 'food';

export interface PartnerCondition {
  id: string;
  name_uz: string | null;
  name_ru: string;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  title_uz: string;
  title_ru: string;
  contact_location_ru: string | null;
  contact_location_uz: string | null;
  contact_phone: string | null;
  contact_site: string | null;
  facebook: string | null;
  instagram: string | null;
  grafik: string | null;
  order: number;
  images: string[];
  info_ru: string | null;
  info_uz: string | null;
  cordinates: string | null;
  logo: string | null;
  partner_card: string | null;
  promo_count: number | null;
  promo_info_ru: string | null;
  promo_info_uz: string | null;
  telegram: string | null;
  type: PartnerType;
  is_visible: boolean;
  conditions: PartnerCondition[];
  created_at: string;
  updated_at: string;
}
