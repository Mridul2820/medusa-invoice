import { Invoice } from "../../../../../models/invoice";
import { generateHr } from "./hr";

export function generateInvoiceInformation(
  doc,
  y: number,
  invoice: Invoice
): number {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Invoice", 50, y + 40);

  generateHr(doc, y + 65);

  const invoiceInformationTop = y + 80;

  doc
    .fontSize(10)
    .text("Invoice number:", 50, invoiceInformationTop)
    .text(invoice.display_number, 150, invoiceInformationTop)
    .text("Invoice date:", 50, invoiceInformationTop + 15)
    .text(
      invoice.created_at.toLocaleDateString(),
      150,
      invoiceInformationTop + 15
    )
    .moveDown();

  return invoiceInformationTop + 15;
}
