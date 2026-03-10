export interface CmsPageListItem {
  id: number;
  title: string;
  slug: string;
}

export interface CmsPageMeta {
  meta_title: string;
  meta_keywords: string;
  meta_description: string;
}

export interface CmsPageDetail extends CmsPageListItem {
  description: string;
  image: string;
  banner: string;
  meta: CmsPageMeta;
}

export interface PagesListApiResponse {
  data: CmsPageListItem[];
  status: number;
  message: string;
}

export interface PageDetailApiResponse {
  data: CmsPageDetail;
  status: number;
  message: string;
}
