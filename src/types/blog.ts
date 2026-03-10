/** Blog list item (GET /blogs) */
export interface BlogListItem {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  banner: string;
  view_count: string;
  published_at: string;
}

/** SEO meta from single blog data.meta */
export interface BlogMeta {
  title: string;
  keywords: string;
  description: string;
}

/** Single comment on a blog */
export interface BlogComment {
  id: number;
  user_name: string;
  comment: string;
  created_at: string;
}

/** Blog detail (GET /blogs/{slug}) */
export interface BlogDetail extends BlogListItem {
  long_description: string;
  gallery_images: string[];
  comments: BlogComment[];
  meta?: BlogMeta;
}

/** Pagination link from API */
export interface BlogMetaLink {
  url: string | null;
  label: string;
  active: boolean;
}

/** Pagination links (GET /blogs) */
export interface BlogsListLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

/** Pagination meta (GET /blogs) */
export interface BlogsListMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: BlogMetaLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface BlogsListApiResponse {
  data: BlogListItem[];
  links: BlogsListLinks;
  meta: BlogsListMeta;
  status: number;
  message?: string;
}

export interface BlogDetailApiResponse {
  data: BlogDetail;
  status: number;
  message?: string;
}

/** Single comment as returned by POST /blogs/{id}/comment */
export interface BlogCommentData {
  id: number;
  user_name: string;
  comment: string;
  created_at: string;
}

export interface BlogCommentApiResponse {
  data: BlogCommentData;
  status: number;
  message?: string;
}

/** Related blogs (GET /blogs/{id}/related) – assume same shape as list */
export interface RelatedBlogsApiResponse {
  data: BlogListItem[];
  status?: number;
  message?: string;
}

/** Newsletter subscribe */
export interface SubscribePayload {
  email: string;
}

export interface SubscribeResponse {
  status?: number;
  message?: string;
}
