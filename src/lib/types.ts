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
  is_public: boolean;
  allow_download: boolean;
  require_email: boolean;
  expiration_date: string | null;
  require_password: boolean;
  password: string | null;
  enable_feedback: boolean;
};
