import { directories, normalize } from './path';

async function _mkdir(parent: FileSystemDirectoryHandle, path: string[]): Promise<FileSystemDirectoryHandle> {
  const name = path.shift();
  if (!name) {
    return parent;
  }

  const child = await parent.getDirectoryHandle(name, { create: true });
  const dir = await _mkdir(child, path);

  return dir;
}

/**
 * Creates all the directories in the path and returns a handle to the last one.
 */
export async function createDir(path: string): Promise<FileSystemDirectoryHandle> {
  const root = await navigator.storage.getDirectory();
  return _mkdir(root, directories(normalize(path)));
}
