import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { DocumentMetadata, Folder } from '@/lib/types';
import DocumentsDashboard from '@/components/documents-dashboard';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user?.id) {
    return <div>Please log in to access the dashboard.</div>;
  }

  const { data: docsData, error: docsError } = await supabase
    .from('document_metadata')
    .select('*')
    .eq('user_id', authData.user.id)
    .order('upload_date', { ascending: false });

  const { data: foldersData, error: foldersError } = await supabase
    .from('folders')
    .select('*')
    .eq('user_id', authData.user.id);

  if (docsError || foldersError) {
    console.error('Error fetching data:', docsError || foldersError);
    return <div>Error loading dashboard data. Please try again later.</div>;
  }

  return (
    <DocumentsDashboard
      documents={(docsData as DocumentMetadata[]) || []}
      folders={(foldersData as Folder[]) || []}
    />
  );
}
