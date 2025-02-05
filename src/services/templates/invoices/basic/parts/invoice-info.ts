import { Invoice } from "../../../../../models/invoice";
import { generateHr } from "./hr";

export function generateInvoiceInformation(
  doc,
  y: number,
  invoice: Invoice
): number {
  doc.fillColor("#444444").fontSize(28).text("Invoice", 50, 50, {
    align: "right",
  });

  const invoiceInformationTop = y + 80;

  doc
    .fontSize(14)
    .text(invoice.display_number, 150, 130, {
      align: "right",
    })
    .text("Date:", 50, 75, {
      align: "right",
    })
    .text(invoice.created_at.toLocaleDateString(), 150, 85, {
      align: "right",
    })
    .moveDown();

  return invoiceInformationTop + 15;
}
