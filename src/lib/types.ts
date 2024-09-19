export type FileMetadata = {
  id: string;
  user_id: string;
  file_id: string;
  original_name: string;
  sanitized_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  upload_date: string;
  last_modified: string;
  is_public: boolean | null;
  allow_download: boolean | null;
  require_email: boolean | null;
  is_expiring: boolean;
  expiration_date: string | null;
  require_password: boolean | null;
  password: string | null;
  enable_feedback: boolean | null;
  require_nda: boolean | null;
  nda_text: string | null;
};

export interface FrontMatter {
  title: string;
  date: string;
  [key: string]: any;
}

export interface Post {
  slug: string;
  frontMatter: FrontMatter;
}

export interface Geolocation {
  city?: string | undefined;
  country?: string | undefined;
  region?: string | undefined;
  latitude?: string | undefined;
  longitude?: string | undefined;
}
