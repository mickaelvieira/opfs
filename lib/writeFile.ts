import { basename, dirname, normalize } from './path';
import { mkdir } from './mkdir';

/**
 * Writes data to a file. It also creates the parent directories.
 */
export async function writeFile(
  filepath: string,
  data: ArrayBuffer | DataView | Blob | string
): Promise<FileSystemFileHandle> {
  const path = normalize(filepath);

  const dir = await mkdir(dirname(path));
  const file = await dir.getFileHandle(basename(path), { create: true });

  const stream = await file.createWritable();
  await stream.write(data);
  await stream.close();

  return file;
}
