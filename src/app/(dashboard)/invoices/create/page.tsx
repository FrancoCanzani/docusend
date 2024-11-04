import CreateInvoiceForm from '@/components/invoice/create-invoice-form';
import DashboardSectionTitle from '@/components/dashboard-section-title';

export default function CreateInvoicePage() {
  return (
    <div>
      <DashboardSectionTitle title='New invoice' />
      <h2 className='text-2xl font-bold mb-8'></h2>
      <CreateInvoiceForm />
    </div>
  );
}
