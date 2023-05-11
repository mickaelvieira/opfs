import { chdir } from './chdir';
import { basename, dirname, normalize } from './path';

/**
 * Returns a File object for the given path.
 */
export async function resolveFileFromPath(path: string): Promise<FileSystemFileHandle> {
  const filepath = normalize(path);
  const filename = basename(filepath);

  const directory = await chdir(dirname(filepath));
  const handle = await directory.getFileHandle(filename);

  return handle;
}

/**
 * Returns a File object for the given path.
 */
export async function getParentDirectory(handle: FileSystemHandle): Promise<FileSystemDirectoryHandle> {
  const root = await navigator.storage.getDirectory();
  const path = await root.resolve(handle);
  if (!path) {
    throw new Error('failed to resolve file');
  }

  if (path.length < 2) {
    return root;
  }

  path.pop();

  const directory = await chdir(path.join('/'));

  return directory;
}
