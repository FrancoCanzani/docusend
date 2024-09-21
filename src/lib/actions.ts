'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';
import { viewDataSchema } from './schemas';
import { z } from 'zod';

const supabase = createClient();

export async function login(formData: FormData) {
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  console.log(data);

  const { error } = await supabase.auth.signInWithPassword(data);

  console.log(error);

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
  file_id: string;
  original_name: string;
  sanitized_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  last_modified: string;
}) {
  const { error } = await supabase.from('file_metadata').insert({
    ...metadata,
    upload_date: new Date().toISOString(),
  });

  if (error) {
    console.error('Error storing document metadata:', error);
    throw new Error('Failed to store document metadata');
  }

  revalidatePath('/dashboard');
}

export async function downloadDocument(filePath: string) {
  const { data, error } = await supabase.storage
    .from('documents')
    .download(filePath);

  if (error) {
    console.error('Error downloading file:', error);
    return null;
  }

  return data;
}

export async function listAllDocuments(userId: string) {
  const { data, error } = await supabase
    .from('file_metadata')
    .select('*')
    .eq('user_id', userId)
    .order('upload_date', { ascending: false });

  if (error) {
    console.error('Error listing documents:', error);
    return null;
  }

  return data;
}

export async function deleteDocument(fileId: string, userId: string) {
  // First, get the file path
  const { data: fileData, error: fetchError } = await supabase
    .from('file_metadata')
    .select('file_path')
    .eq('file_id', fileId)
    .eq('user_id', userId)
    .single();

  if (fetchError) {
    console.error('Error fetching file metadata:', fetchError);
    return false;
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('documents')
    .remove([fileData.file_path]);

  if (storageError) {
    console.error('Error deleting file from storage:', storageError);
    return false;
  }

  // Delete metadata
  const { error: dbError } = await supabase
    .from('file_metadata')
    .delete()
    .match({ file_id: fileId, user_id: userId });

  if (dbError) {
    console.error('Error deleting document metadata:', dbError);
    return false;
  }

  return true;
}

export async function saveDocumentSettings(
  fileId: string,
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
  const { data: user } = await supabase.auth.getUser();

  if (!user || !user.user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('file_metadata')
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
    .match({ file_id: fileId, user_id: user.user.id });

  if (error) {
    console.error('Error updating document settings:', error);
    throw new Error('Failed to update document settings');
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function recordDocumentView(formData: FormData) {
  const supabase = createClient();

  try {
    const parsedData = viewDataSchema.parse({
      fileId: formData.get('fileId'),
      userId: formData.get('userId'),
      email: formData.get('email'),
      timeSpent: parseInt(formData.get('timeSpent') as string),
    });

    const viewData = {
      file_id: parsedData.fileId,
      user_id: parsedData.userId,
      email: parsedData.email,
      time_spent: parsedData.timeSpent,
      timestamp: new Date().toISOString(),
    };

    const { error } = await supabase.from('file_views').insert(viewData);

    if (error) throw error;

    revalidatePath(`/file/${parsedData.fileId}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to record view:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid data format',
        details: error.errors,
      };
    }
    return { success: false, error: 'Failed to record view' };
  }
}
