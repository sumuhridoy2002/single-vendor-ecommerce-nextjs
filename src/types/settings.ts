/** Global site settings from /settings API. */
export interface GlobalSettings {
  site_name: string;
  site_tagline: string;
  currency: string;
  site_description: string;
  site_address: string;
  search_placeholders: string[];
  trade_license: string;
  bin_no: string;
  support_phone: string;
  social_fb: string;
  social_ig: string;
  social_yt: string;
  social_wa: string;
  social_imo: string;
  social_tiktok: string;
  bkash_status: boolean;
  cod_status: boolean;
  favicon: string;
  logo: string;
  tin_no: string;
}

export interface SettingsApiResponse {
  data: GlobalSettings;
  status: number;
  message: string;
}
