import dayjs from "dayjs";
import { OrderStatus } from "@medusajs/utils";
import { Invoice } from "../../../../../models/invoice";

export function generateInvoiceInformation(
  doc,
  y: number,
  invoice: Invoice
): number {
  const startX = 300;
  const startY = y + 30;
  const lineSpacing = 25;

  const invoiceDetails = [
    {
      label: "Date:",
      value: dayjs(invoice?.created_at).format("MMM DD, YYYY"),
    },
    {
      label: "Payment Terms:",
      value: invoice?.order?.payment_status === "captured" ? "Prepaid" : "COD",
    },
    {
      label: "Due Date:",
      value: dayjs(invoice?.created_at).format("MMM DD, YYYY"),
    },
    { label: "PO Number:", value: "NA" },
    {
      label: "Balance Due:",
      value:
        invoice?.order?.status === ("captured" as OrderStatus)
          ? "₹0.00"
          : invoice?.order?.total,
    },
  ];

  let currentY = startY;

  const labelStyle = {
    font: "Helvetica",
    fontSize: 10,
    color: "#666666",
  };

  const valueStyle = {
    font: "Helvetica",
    fontSize: 10,
    color: "#000000",
  };

  invoiceDetails.forEach((detail, index) => {
    doc
      .font(labelStyle.font)
      .fontSize(labelStyle.fontSize)
      .fillColor(labelStyle.color)
      .text(detail.label, startX, currentY, { align: "right" });

    doc
      .font(valueStyle.font)
      .fontSize(valueStyle.fontSize)
      .fillColor(valueStyle.color)
      .text(detail.value, startX + 150, currentY, { align: "right" });

    if (detail.label === "Balance Due:") {
      doc.rect(startX - 10, currentY - 5, 300, 25).fill("#f5f5f5");

      doc
        .font(labelStyle.font)
        .fontSize(labelStyle.fontSize)
        .fillColor("#000000")
        .text(detail.label, startX, currentY + 2, { align: "right" })
        .font(valueStyle.font)
        .fontSize(valueStyle.fontSize)
        .fillColor("#000000")
        .text(detail.value, startX + 150, currentY + 2, { align: "right" });
    }

    currentY += lineSpacing;
  });

  return currentY;
}
