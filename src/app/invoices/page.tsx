import { Sidebar } from '@/components/sidebar';
import CreateInvoiceSheet from '@/components/invoice/create-invoice-sheet';
import { createClient } from '@/lib/supabase/server';
import { InvoicesTable } from '@/components/invoice/invoices-table';
import { InvoiceStats } from '@/components/invoice/invoice-stats';

export default async function InvoicesPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error:', error);
    return <div>Failed to load invoices</div>;
  }

  return (
    <div className='flex h-screen'>
      <Sidebar />
      <main className='flex-1 flex flex-col p-4 px-6 w-full overflow-auto'>
        <div className='flex flex-col w-full'>
          <div className='flex justify-between items-center mb-8'>
            <h2 className='text-2xl font-bold'>Invoices</h2>
            <CreateInvoiceSheet />
          </div>
          <div className='flex-1 space-y-6'>
            <InvoiceStats data={invoices || []} />
            <InvoicesTable data={invoices || []} />
          </div>
        </div>
      </main>
    </div>
  );
}
