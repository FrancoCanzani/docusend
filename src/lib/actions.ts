'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';
import { nanoid } from 'nanoid';

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

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
  redirect('/dashboard');
}

const supabase = createClient();

export async function uploadDocument(file: File, userId: string) {
  const fileId = nanoid();
  const filePath = `${userId}/${fileId}/${file.name}`;

  const { data, error } = await supabase.storage
    .from('documents')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }

  // Store document metadata
  await storeDocumentMetadata(fileId, file.name, userId);

  return data;
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

export async function listAllDocuments() {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error listing documents:', error);
    return null;
  }

  return data;
}

export async function deleteDocument(filePath: string, documentId: string) {
  const { error: storageError } = await supabase.storage
    .from('documents')
    .remove([filePath]);

  if (storageError) {
    console.error('Error deleting file from storage:', storageError);
    return false;
  }

  const { error: dbError } = await supabase
    .from('documents')
    .delete()
    .match({ id: documentId });

  if (dbError) {
    console.error('Error deleting document metadata:', dbError);
    return false;
  }

  return true;
}

async function storeDocumentMetadata(
  fileId: string,
  fileName: string,
  uploaderId: string
) {
  const { error } = await supabase
    .from('documents')
    .insert({ id: fileId, name: fileName, uploader_id: uploaderId });

  if (error) {
    console.error('Error storing document metadata:', error);
  }
}
