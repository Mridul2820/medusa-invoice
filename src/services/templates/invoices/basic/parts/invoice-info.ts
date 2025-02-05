import { Invoice } from "../../../../../models/invoice";

export function generateInvoiceInformation(
  doc,
  y: number,
  invoice: Invoice
): number {
  doc.fillColor("#444444").fontSize(28).text("Invoice", 40, 50, {
    align: "right",
  });

  const invoiceInformationTop = y + 80;

  doc.fontSize(14).text(invoice.display_number, 40, 70, {
    align: "right",
  });

  return invoiceInformationTop + 15;
}
