import { DocumentSettings } from "../../../../../models/document-settings";

export function generateHeader(
  doc,
  y: number,
  documentSettings: DocumentSettings
): number {
  doc.fillColor("#444444").fontSize(12);

  doc.text("Packing Slip", 25, y, { align: "left" });

  const heightCompany = doc.heightOfString(
    documentSettings.store_address.company,
    { align: "left" }
  );
  doc
    .fontSize(6)
    .text(documentSettings.store_address.company, 25, y + 25, { align: "left" })
    .text(
      `${documentSettings.store_address.city} ${documentSettings.store_address.postal_code}`,
      25,
      y + 35,
      { align: "left" }
    );

  const heightAddress = doc.heightOfString(
    documentSettings.store_address.address_1,
    { width: 150 }
  );

  doc.text(`${documentSettings.store_address.address_1}`, 25, y + 45, {
    align: "left",
  });

  if (heightCompany > heightAddress + 45) {
    return heightCompany + y;
  } else {
    return heightAddress + y + 45;
  }
}
