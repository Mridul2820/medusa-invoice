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

  const baseY = 140;

  doc
    .fillColor("#444444")
    .fontSize(11)
    .font("Helvetica-Bold")
    .text(documentSettings.store_address.company, 50, baseY + 5, {
      align: "left",
      width: 250,
    })
    .font("Helvetica")
    .fontSize(10)
    .text(
      `${documentSettings.store_address.address_1}, ${documentSettings.store_address.city} ${documentSettings.store_address.postal_code}`,
      50,
      baseY + 25,
      { align: "left", width: 215 }
    )
    .text("Email: care@terrapy.in", 50, baseY + 60, { align: "left" })
    .text("Mobile: +91 9820492929", 50, baseY + 75, { align: "left" })
    .text("GST: 27AAKCT4563G1Z1", 50, baseY + 90, { align: "left" });
  const heightOfAddress = doc.heightOfString(
    documentSettings.store_address.address_1,
    { width: 250 }
  );

  return heightOfAddress + heightCompany + 95;
}
