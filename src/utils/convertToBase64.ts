export async function convertToBase64(image: File | undefined) {
  if (image) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const imageUrl = `data:image/png;base64,${base64}`;
    return imageUrl;
  } else {
    return null;
  }
}
