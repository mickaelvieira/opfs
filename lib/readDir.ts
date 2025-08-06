import { changeDir } from './changeDir';

/**
 * Returns a Map containing the entries of the directory at the given path.
 */
export async function readDir(
  pathOrHandle: string | FileSystemDirectoryHandle
): Promise<Map<string, FileSystemHandle>> {
  const entries = new Map<string, FileSystemHandle>();
  const root = await navigator.storage.getDirectory();
  const dir = typeof pathOrHandle === 'string' ? await changeDir(pathOrHandle) : pathOrHandle;

  for await (const handle of dir.values()) {
    const path = await root.resolve(handle);
    if (!path) {
      console.warn(`Failed to resolve path of file ${handle.name} from ${root.name}`);
      continue;
    }
    entries.set(`${path.join('/')}`, handle);
  }

  return entries;
}
