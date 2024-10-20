'use server';
import { jsPDF } from 'jspdf';
import { InvoiceData } from '../types';

export async function createInvoicePdf(data: InvoiceData): Promise<string> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let yPos = margin;

  // Set default font
  doc.setFont('helvetica', 'normal');

  // Function to set bold style for labels
  const setBoldStyle = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
  };

  // Function to set normal style for content
  const setNormalStyle = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
  };

  // Function to set monospace style for numbers
  const setMonoStyle = () => {
    doc.setFont('courier', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
  };

  // Function to add footer to each page
  const addFooter = (pageNum: number, totalPages: number) => {
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    // Add "Generated with DocuSend" on the left
    doc.text('Generated with DocuSend', margin, pageHeight - 10);
    // Add page numbers on the right
    doc.text(
      `Page ${pageNum} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: 'right' }
    );
  };

  // Function to add a new page
  const addNewPage = () => {
    doc.addPage();
    yPos = margin;
    // Add table headers on the new page
    addTableHeaders();
  };

  // Function to check if we need a new page
  const checkNewPage = (height: number) => {
    if (yPos + height > pageHeight - margin) {
      addNewPage();
      return true;
    }
    return false;
  };

  // Updated wrapText function
  const wrapText = (text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = doc.getTextWidth(testLine);
      if (testWidth > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  // Add "Invoice" title
  doc.setFontSize(40);
  doc.setTextColor(20, 20, 20);
  const titleHeight = doc.getTextDimensions('Invoice').h;
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice', margin, yPos + titleHeight);

  // Add logo aligned with the upper half of the title
  if (data.logo) {
    const logoSize = 11;
    const logoY = yPos + (titleHeight - logoSize + 1.3);
    doc.addImage(
      data.logo,
      'PNG',
      pageWidth - margin - logoSize,
      logoY,
      logoSize,
      logoSize
    );
  }
  yPos += titleHeight + 5;

  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;

  // Add sender and customer details side by side
  setBoldStyle();
  doc.text('From', margin, yPos);
  doc.text('To', pageWidth / 2, yPos);
  yPos += 10;

  setNormalStyle();
  const senderDetails = [data.senderEmail, ...data.senderDetails.split('\n')];
  const customerDetails = [
    data.customerEmail,
    ...data.customerDetails.split('\n'),
  ];

  const maxWidth = pageWidth / 2 - margin - 5; // 5 is for some extra padding
  let senderYPos = yPos;
  let customerYPos = yPos;

  senderDetails.forEach((detail) => {
    const lines = wrapText(detail, maxWidth);
    lines.forEach((line) => {
      doc.text(line, margin, senderYPos);
      senderYPos += 5;
    });
  });

  customerDetails.forEach((detail) => {
    const lines = wrapText(detail, maxWidth);
    lines.forEach((line) => {
      doc.text(line, pageWidth / 2, customerYPos);
      customerYPos += 5;
    });
  });

  yPos = Math.max(senderYPos, customerYPos) + 10;

  // Add invoice details
  setBoldStyle();
  doc.text('Details', margin, yPos);
  yPos += 10;
  doc.text('Invoice no', margin, yPos);
  setNormalStyle();
  doc.text(data.invoiceID, margin + 20, yPos);
  yPos += 15;

  // Define table layout with padding
  const tableStart = margin;
  const itemWidth = 100;
  const rateWidth = 50;
  const quantityStart = tableStart + itemWidth + 5;
  const rateStart = pageWidth - margin - rateWidth;
  const cellPadding = 2;

  // Function to add table headers with rounded corners
  const addTableHeaders = () => {
    doc.setFillColor(250, 250, 250); // Even lighter grey color
    const headerHeight = 8;
    const cornerRadius = 2;
    doc.roundedRect(
      tableStart,
      yPos - 4,
      pageWidth - 2 * margin,
      headerHeight,
      cornerRadius,
      cornerRadius,
      'F'
    );
    setBoldStyle();
    const textHeight = doc.getTextDimensions('Item').h;
    const textYPos = yPos - 4 + headerHeight / 2 + textHeight / 2; // Center text vertically
    doc.text('Item', tableStart + cellPadding, textYPos);
    doc.text('Quantity', quantityStart, textYPos, { align: 'right' });
    doc.text('Rate', rateStart + rateWidth - cellPadding, textYPos, {
      align: 'right',
    });
    yPos += headerHeight + 2; // Add a small gap after the header
  };

  // Add initial table headers
  addTableHeaders();

  // Add items with padding and right-aligned prices
  setNormalStyle();
  data.items.forEach((item, index) => {
    if (checkNewPage(20)) {
      // Check if we need a new page before adding an item
      addTableHeaders();
    }
    doc.text(item.description, tableStart + cellPadding, yPos);
    setMonoStyle();
    doc.text(item.quantity.toString(), quantityStart, yPos, { align: 'right' });
    doc.text(item.rate.toFixed(2), rateStart + rateWidth - cellPadding, yPos, {
      align: 'right',
    });
    setNormalStyle();
    yPos += 10;
  });
  yPos += 5;

  // Check if we need a new page before adding totals
  checkNewPage(60);

  // Add subtotal, discount, tax, and total
  const rightAlign = pageWidth - margin;
  setBoldStyle();
  doc.text('Subtotal:', rightAlign - 70, yPos);
  setMonoStyle();
  doc.text(data.subtotal.toFixed(2), rightAlign - cellPadding, yPos, {
    align: 'right',
  });
  yPos += 8;

  setBoldStyle();
  doc.text(`Discount (${data.discount}%):`, rightAlign - 70, yPos);
  setMonoStyle();
  const discountAmount = data.subtotal * (data.discount / 100);
  doc.text(discountAmount.toFixed(2), rightAlign - cellPadding, yPos, {
    align: 'right',
  });
  yPos += 8;

  // Add tax information
  setBoldStyle();
  doc.text(`Tax (${data.tax}%):`, rightAlign - 70, yPos);
  setMonoStyle();
  const taxAmount = (data.subtotal - discountAmount) * (data.tax / 100);
  doc.text(taxAmount.toFixed(2), rightAlign - cellPadding, yPos, {
    align: 'right',
  });
  yPos += 12;

  doc.setFontSize(11);
  setBoldStyle();
  doc.text('Total:', rightAlign - 70, yPos);
  setMonoStyle();
  doc.setFontSize(11);
  doc.text(data.total.toFixed(2), rightAlign - cellPadding, yPos, {
    align: 'right',
  });
  yPos += 20;

  // Check if we need a new page before adding terms and notes
  checkNewPage(50);

  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;

  // Add terms and notes side by side
  setBoldStyle();
  doc.text('Terms', margin, yPos);
  doc.text('Notes', pageWidth / 2, yPos);
  yPos += 5; // Small gap after headers

  setNormalStyle();
  doc.text(`Currency: ${data.currency}`, margin, yPos);
  yPos += 5;
  doc.text(
    `Invoice date: ${new Date(data.dates.issueDate).toLocaleDateString()}`,
    margin,
    yPos
  );
  yPos += 5;
  doc.text(
    `Due date: ${new Date(data.dates.dueDate).toLocaleDateString()}`,
    margin,
    yPos
  );

  // Reset yPos for notes
  yPos -= 10;
  const noteText = data.notes || 'Thanks for your business!';
  const noteLines = doc.splitTextToSize(noteText, pageWidth / 2 - margin - 5);
  doc.text(noteLines, pageWidth / 2, yPos);

  // Add footer to all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter(i, pageCount);
  }

  // Generate PDF as base64 string
  const pdfOutput = doc.output('datauristring');
  return pdfOutput;
}
