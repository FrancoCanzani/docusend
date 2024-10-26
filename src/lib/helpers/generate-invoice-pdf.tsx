import { InvoiceData } from '@/lib/types';
import { compile } from '@fileforge/react-print';
import { InvoiceTemplate } from '@/components/invoice/invoice-template';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default async function generateInvoicePDF(
  invoiceData: InvoiceData
): Promise<void> {
  try {
    const html = await compile(<InvoiceTemplate data={invoiceData} />);

    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.width = '210mm'; // A4 width
    container.style.position = 'fixed';
    container.style.top = '-9999px';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    const canvas = await html2canvas(container, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      windowWidth: container.scrollWidth,
    });

    document.body.removeChild(container);

    // Initialize PDF
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Add image to PDF
    let position = 0;
    let heightLeft = imgHeight;

    // First page
    pdf.addImage(
      canvas.toDataURL('image/jpeg', 1.0),
      'JPEG',
      0,
      position,
      imgWidth,
      imgHeight
    );
    heightLeft -= pageHeight;

    // Add subsequent pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;
    }

    // Save the PDF
    const filename = `${invoiceData.invoiceId.replace(
      /[^a-zA-Z0-9]/g,
      '_'
    )}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}
