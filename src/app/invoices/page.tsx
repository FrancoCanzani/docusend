import { Sidebar } from '@/components/sidebar';
import CreateInvoiceSheet from '@/components/invoice/create-invoice-sheet';

export default function InvoicesPage() {
  return (
    <div className='flex h-screen'>
      <Sidebar />
      <main className='flex-1 p-4 overflow-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h2 className='text-2xl font-bold'>Invoices</h2>
          <div className='flex items-end space-x-2'>
            <CreateInvoiceSheet />
          </div>
        </div>
      </main>
    </div>
  );
}
