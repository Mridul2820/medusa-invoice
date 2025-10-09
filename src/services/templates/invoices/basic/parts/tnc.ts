export function generateTnc(doc, y: number): number {
  const invoiceInformationTop = y + 20;

  doc
    .fillColor("#666666")
    .fontSize(8)
    .text("Terms & Condition:", 50, invoiceInformationTop, {
      align: "left",
    })
    .fillColor("#444444")
    .text(
      "If shipment is received in damaged condition, inform our customer care team within 2 working days. Any claim for damage shall not be entertained after 2 days of delivery",
      50,
      invoiceInformationTop + 16,
      {
        align: "left",
      }
    )
    .moveDown();

  return invoiceInformationTop + 15;
}
