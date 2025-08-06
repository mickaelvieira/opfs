/**
 * Returns a Map containing the entries of the directory at the given path.
 */
export async function walkDir(
  root: FileSystemDirectoryHandle,
  parent?: FileSystemDirectoryHandle
): Promise<Map<string, FileSystemHandle>> {
  const dir = parent ?? root;
  const entries = new Map<string, FileSystemHandle>();

  for await (const handle of dir.values()) {
    const path = await root.resolve(handle);
    if (!path) {
      console.warn(`Failed to resolve path of file ${handle.name} from ${root.name}`);
      continue;
    }

    entries.set(`${path.join('/')}`, handle);

    if (handle.kind === 'directory') {
      const map = await walkDir(root, handle);
      for (const [path, handle] of map) {
        entries.set(path, handle);
      }
    }
  }

  return entries;
}
