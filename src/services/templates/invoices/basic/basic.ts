import { Order } from "@medusajs/medusa";
import { Invoice } from "../../../../models/invoice";
import { DocumentSettings } from "../../../../models/document-settings";
import PDFDocument from "pdfkit";
import { generateHeader } from "./parts/header";
import { generateCustomerInformation } from "./parts/customer-info";
import { generateInvoiceTable } from "./parts/table";
import { generateInvoiceInformation } from "./parts/invoice-info";
import path from "path";

export function validateInput(settings?: DocumentSettings): [boolean, string] {
  if (
    settings &&
    settings.store_address &&
    settings.store_address.company &&
    settings.store_address.address_1 &&
    settings.store_address.city &&
    settings.store_address.postal_code
  )
    return [true, ""];
  return [
    false,
    `Not all settings are defined to generate template. Following settings are checked: company, address, city, postal_code`,
  ];
}

export default async (
  settings: DocumentSettings,
  invoice: Invoice,
  order: Order
): Promise<Buffer> => {
  var doc = new PDFDocument();

  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));

  const endHeader = generateHeader(doc, 50, settings);
  const endInvoiceInfo = generateInvoiceInformation(
    doc,
    endHeader,
    invoice,
    order
  );
  const endY = generateCustomerInformation(doc, endInvoiceInfo, order);
  generateInvoiceTable(doc, endY, order, order.items);

  doc.end();

  const bufferPromise = new Promise<Buffer>((resolve) => {
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
  });

  return await bufferPromise;
};
