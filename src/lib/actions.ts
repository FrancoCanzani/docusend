'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { data: authData, error } = await supabase.auth.signInWithPassword(
    data
  );

  console.log(error);
  console.log(authData);

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const supabase = createClient();

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
  const supabase = createClient();

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
  const supabase = createClient();

  const { error } = await supabase.from('document_metadata').insert({
    ...metadata,
    upload_date: new Date().toISOString(),
  });

  if (error) {
    console.error('Error storing document metadata:', error);
    throw new Error('Failed to store document metadata');
  }

  revalidatePath('/dashboard');
}

export async function downloadDocument(documentPath: string) {
  const supabase = createClient();

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
  const supabase = createClient();

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
  const supabase = createClient();

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
  const supabase = createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user || !user.user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('document_metadata')
    .update({
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

  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteFolder(folderId: string) {
  const supabase = createClient();

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
    revalidatePath('/dashboard');
  }
}
