'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';
import { InvoiceData } from './types';

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { data: authData, error } = await supabase.auth.signInWithPassword(
    data
  );

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/documents');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;

  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: 'https://example.com/welcome',
    },
  });
}

export async function uploadDocument(metadata: {
  user_id: string;
  document_id: string;
  original_name: string;
  sanitized_name: string;
  document_path: string;
  document_size: number;
  document_type: string;
  last_modified: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from('document_metadata').insert({
    ...metadata,
    upload_date: new Date().toISOString(),
  });

  if (error) {
    console.error('Error storing document metadata:', error);
    throw new Error('Failed to store document metadata');
  }

  revalidatePath('/documents');
}

export async function downloadDocument(documentPath: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from('documents')
    .download(documentPath);

  if (error) {
    console.error('Error downloading document:', error);
    return null;
  }

  return data;
}

export async function listAllDocuments(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('document_metadata')
    .select('*')
    .eq('user_id', userId)
    .order('upload_date', { ascending: false });

  if (error) {
    console.error('Error listing documents:', error);
    return null;
  }

  return data;
}

export async function deleteDocument(documentId: string, userId: string) {
  const supabase = await createClient();

  // First, get the document path
  const { data: documentData, error: fetchError } = await supabase
    .from('document_metadata')
    .select('document_path')
    .eq('document_id', documentId)
    .eq('user_id', userId)
    .single();

  if (fetchError) {
    console.error('Error fetching document metadata:', fetchError);
    return false;
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('documents')
    .remove([documentData.document_path]);

  if (storageError) {
    console.error('Error deleting document from storage:', storageError);
    return false;
  }

  // Delete metadata
  const { error: dbError } = await supabase
    .from('document_metadata')
    .delete()
    .match({ document_id: documentId, user_id: userId });

  if (dbError) {
    console.error('Error deleting document metadata:', dbError);
    return false;
  }

  return true;
}

export async function saveDocumentSettings(
  documentId: string,
  settings: {
    original_name: string;
    sanitized_name: string;
    is_public: boolean;
    allow_download: boolean;
    require_email: boolean;
    is_expiring: boolean;
    expiration_date: string | null;
    require_password: boolean;
    password: string | null;
    enable_feedback: boolean;
    require_nda: boolean;
    nda_text: string | null;
  }
) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user || !user.user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('document_metadata')
    .update({
      original_name: settings.original_name,
      sanitized_name: settings.sanitized_name,
      is_public: settings.is_public,
      allow_download: settings.allow_download,
      require_email: settings.require_email,
      is_expiring: settings.is_expiring,
      expiration_date: settings.expiration_date,
      require_password: settings.require_password,
      password: settings.password,
      enable_feedback: settings.enable_feedback,
      require_nda: settings.require_nda,
      nda_text: settings.nda_text,
      last_modified: new Date().toISOString(),
    })
    .match({ document_id: documentId, user_id: user.user.id });

  if (error) {
    console.error('Error updating document settings:', error);
    throw new Error('Failed to update document settings');
  }

  revalidatePath('/documents');
  return { success: true };
}

export async function deleteFolder(folderId: string) {
  const supabase = await createClient();

  try {
    // 1. Fetch documents in the folder
    const { data: documents, error: fetchError } = await supabase
      .from('document_metadata')
      .select('document_path')
      .eq('folder_id', folderId);

    if (fetchError) throw fetchError;

    // 2. Delete files from the storage bucket
    if (documents && documents.length > 0) {
      const filePaths = documents.map((doc) => doc.document_path);
      const { error: deleteStorageError } = await supabase.storage
        .from('documents')
        .remove(filePaths);

      if (deleteStorageError) throw deleteStorageError;
    }

    // 3. Delete document metadata
    const { error: metadataError } = await supabase
      .from('document_metadata')
      .delete()
      .eq('folder_id', folderId);

    if (metadataError) throw metadataError;

    // 4. Delete the folder
    const { error: folderError } = await supabase
      .from('folders')
      .delete()
      .eq('id', folderId);

    if (folderError) throw folderError;
  } catch (err) {
    console.error('Error deleting folder:', err);
    throw err;
  } finally {
    revalidatePath('/documents');
  }
}

export async function createInvoice(data: InvoiceData) {
  try {
    const supabase = await createClient();

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Auth error:', userError);
      throw userError;
    }

    if (!userData.user) {
      throw new Error('No authenticated user found');
    }

    const invoiceData = {
      user_id: userData.user.id,
      invoice_id: data.invoiceId,
      sender_name: data.senderName,
      sender_email: data.senderEmail,
      sender_details: data.senderDetails,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_details: data.customerDetails,
      currency: data.currency,
      issue_date: new Date(data.dates.issueDate),
      due_date: new Date(data.dates.dueDate),
      items: data.items,
      discount: data.discount,
      tax: data.tax,
      notes: data.notes,
      payment_details: data.paymentDetails,
      subtotal: data.subtotal,
      total: data.total,
      received: false,
    };

    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert(invoiceData)
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      throw error;
    }

    return invoice;
  } catch (error) {
    console.error('Create invoice error:', error);
    throw error;
  }
}

export async function getInvoice(id: string) {
  const supabase = await createClient();

  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return invoice;
}

export async function getUserInvoices() {
  const supabase = await createClient();

  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return invoices;
}

export async function markInvoiceAsReceived(id: string) {
  const supabase = await createClient();

  const { data: invoice, error } = await supabase
    .from('invoices')
    .update({ received: true })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return invoice;
}
