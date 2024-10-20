export type DocumentMetadata = {
  id: string;
  user_id: string;
  document_id: string;
  original_name: string;
  sanitized_name: string;
  document_path: string;
  document_size: number;
  document_type: string;
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
  folder_id: string | null;
};

export type Folder = {
  id: string;
  name: string;
  user_id: string;
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

export interface InvoiceData {
  invoiceID: string;
  logo: string | null;
  senderEmail: string;
  senderDetails: string;
  customerEmail: string;
  customerDetails: string;
  currency: string;
  dates: {
    issueDate: string;
    dueDate: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
  }>;
  discount: number;
  tax: number;
  notes: string;
  subtotal: number;
  total: number;
}
