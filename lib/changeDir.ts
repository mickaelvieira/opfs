import { directories, normalize } from './path';

async function _chdir(parent: FileSystemDirectoryHandle, path: string[]): Promise<FileSystemDirectoryHandle> {
  const name = path.shift();
  if (!name) {
    return parent;
  }

  const child = await parent.getDirectoryHandle(name);
  const dir = await _chdir(child, path);

  return dir;
}

/**
 * Returns a handle to the last directory in the path.
 */
export async function changeDir(path: string): Promise<FileSystemDirectoryHandle> {
  const root = await navigator.storage.getDirectory();
  return _chdir(root, directories(normalize(path)));
}
