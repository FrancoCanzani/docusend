"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

const supabase = createClient();

export async function login(formData: FormData) {
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  console.log(data);

  const { error } = await supabase.auth.signInWithPassword(data);

  console.log(error);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;

  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: "https://example.com/welcome",
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
  const { error } = await supabase.from("file_metadata").insert({
    ...metadata,
    upload_date: new Date().toISOString(),
  });

  if (error) {
    console.error("Error storing document metadata:", error);
    throw new Error("Failed to store document metadata");
  }

  revalidatePath("/dashboard");
}

export async function downloadDocument(filePath: string) {
  const { data, error } = await supabase.storage
    .from("documents")
    .download(filePath);

  if (error) {
    console.error("Error downloading file:", error);
    return null;
  }

  return data;
}

export async function listAllDocuments(userId: string) {
  const { data, error } = await supabase
    .from("file_metadata")
    .select("*")
    .eq("user_id", userId)
    .order("upload_date", { ascending: false });

  if (error) {
    console.error("Error listing documents:", error);
    return null;
  }

  return data;
}

export async function deleteDocument(fileId: string, userId: string) {
  // First, get the file path
  const { data: fileData, error: fetchError } = await supabase
    .from("file_metadata")
    .select("file_path")
    .eq("file_id", fileId)
    .eq("user_id", userId)
    .single();

  if (fetchError) {
    console.error("Error fetching file metadata:", fetchError);
    return false;
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from("documents")
    .remove([fileData.file_path]);

  if (storageError) {
    console.error("Error deleting file from storage:", storageError);
    return false;
  }

  // Delete metadata
  const { error: dbError } = await supabase
    .from("file_metadata")
    .delete()
    .match({ file_id: fileId, user_id: userId });

  if (dbError) {
    console.error("Error deleting document metadata:", dbError);
    return false;
  }

  return true;
}
