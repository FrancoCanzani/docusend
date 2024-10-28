import CreateInvoiceForm from '@/components/invoice/create-invoice-form';

export default function CreateInvoicePage() {
  return (
    <div>
      <h2 className='text-2xl font-bold mb-8'>New invoice</h2>
      <CreateInvoiceForm />
    </div>
  );
}
