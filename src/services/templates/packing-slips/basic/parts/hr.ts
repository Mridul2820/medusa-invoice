export function generateHr(doc, y: number, moveTo?: number, lineTo?: number) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(moveTo ? moveTo : 50, y)
    .lineTo(lineTo ? lineTo : 550, y)
    .stroke();
}

export function generateHrInA7(doc, y: number) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(25, y).lineTo(190, y).stroke();
}
