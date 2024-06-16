import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { codeGenerator } from "./codeGenerator";

export async function saveFile(file: any, mainPath: string) {
  const fileName = `${codeGenerator(20)}${path.extname(file.name)}`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const directoryPath = `public/images/${mainPath}`;
  const filePath = `${directoryPath}/${fileName}`;
  await mkdir(directoryPath, { recursive: true });
  await writeFile(filePath, buffer);
  return fileName;
}
