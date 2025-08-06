import { createDir } from './createDir';
import { basename, dirname, normalize } from './path';

/**
 * Writes data to a file. It also creates the parent directories.
 */
export async function createFile(
  filepath: string,
  data: ArrayBuffer | DataView | Blob | string
): Promise<FileSystemFileHandle> {
  const path = normalize(filepath);

  const dir = await createDir(dirname(path));
  const file = await dir.getFileHandle(basename(path), { create: true });

  const stream = await file.createWritable();
  await stream.write(data);
  await stream.close();

  return file;
}
