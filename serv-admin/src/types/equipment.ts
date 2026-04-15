export interface MainChar {
  id: string;
  name_uz: string;
  name_ru: string;
  equipment_id: string;
  created_at: string;
  updated_at: string;
}

export interface Equipment {
  id: string;
  title_uz: string;
  title_ru: string;
  more_btn_uz: string;
  more_btn_ru: string;
  info_uz: string;
  info_ru: string;
  img: string;
  description_uz: string | null;
  description_ru: string | null;
  seo_uz: string | null;
  seo_ru: string | null;
  is_visible: boolean;
  main_chars: MainChar[];
  created_at: string;
  updated_at: string;
}
