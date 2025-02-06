export async function generateHeaderLogo(
  doc,
  y: number,
  logoSource: string
): Promise<number> {
  const responseImage = await fetch(logoSource);

  if (responseImage.ok && responseImage.status == 200) {
    const responseImageBuffer = await responseImage.arrayBuffer();
    const responseBuffer = Buffer.from(responseImageBuffer);
    doc.image(responseBuffer, 30, y, { align: "left", width: 70 });
  } else {
    doc.text("Cannot get logo from provided URL"),
      390,
      y,
      { align: "right", width: 160 };
  }

  return y;
}
