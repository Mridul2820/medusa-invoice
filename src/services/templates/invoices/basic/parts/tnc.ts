export function generateTnc(doc, y: number): number {
  const invoiceInformationTop = y + 30;

  doc
    .fillColor("#444444")
    .fontSize(10)
    .text("Terms & Condition:", 50, invoiceInformationTop, {
      align: "left",
    })
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
