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
    .text(documentSettings.store_address.company, 50, 50, {
      align: "left",
      width: 250,
    })
    .moveDown()
    .fontSize(10)
    .text(documentSettings.store_address.company, 50, heightCompany + 65, {
      align: "left",
    })
    .text(
      `${documentSettings.store_address.city} ${documentSettings.store_address.postal_code}`,
      50,
      heightCompany + 80,
      { align: "left" }
    )
    .moveDown()
    .text(" ", 50, heightCompany + 100) // Adding a space of 20px
    .text("Email: care@terrapy.in", 50, heightCompany + 120, { align: "left" })
    .text("Mobile: 9090909090", 50, heightCompany + 135, { align: "left" })
    .text("GST: ABC123456789ABC", 50, heightCompany + 150, { align: "left" });
  const heightOfAddress = doc.heightOfString(
    documentSettings.store_address.address_1,
    { width: 250 }
  );
  doc.text(documentSettings.store_address.address_1, 50, heightCompany + 95, {
    align: "left",
    width: 250,
  });

  return heightOfAddress + heightCompany + 95;
}
