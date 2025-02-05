import { DocumentSettings } from "../../../../../models/document-settings";

export function generateHeaderForLogo(
  doc,
  y: number,
  documentSettings: DocumentSettings
): number {
  doc.fillColor("#444444").fontSize(20);

  const heightCompany = doc.heightOfString(
    documentSettings.store_address.company,
    { width: 250 }
  );

  doc
    .fillColor("#444444")
    .fontSize(11)
    .font("Helvetica-Bold")
    .text(documentSettings.store_address.company, 50, 200, {
      align: "left",
      width: 250,
    })
    .font("Helvetica")
    .fontSize(10)
    .text(
      `${documentSettings.store_address.address_1}, ${documentSettings.store_address.city} ${documentSettings.store_address.postal_code}`,
      50,
      225,
      { align: "left", width: 215 }
    )
    .text("Email: care@terrapy.in", 50, 250, { align: "left" })
    .text("Mobile: 9090909090", 50, 265, { align: "left" })
    .text("GST: ABC123456789ABC", 50, 280, { align: "left" });
  const heightOfAddress = doc.heightOfString(
    documentSettings.store_address.address_1,
    { width: 250 }
  );

  return heightOfAddress + heightCompany + 95;
}
