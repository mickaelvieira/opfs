export interface DirectoryStats {
  count: number;
  size: number;
  lastModified: number;
}

export type DirectoriesStats = WeakMap<FileSystemDirectoryHandle, DirectoryStats>;

export async function statDirectories(dirs: FileSystemDirectoryHandle[]): Promise<DirectoriesStats> {
  const stats = new WeakMap<FileSystemDirectoryHandle, DirectoryStats>();
  for (const dir of dirs) {
    if (dir.kind !== 'directory') {
      continue;
    }
    const stat = await statDirectory(dir);
    stats.set(dir, stat);
  }
  return stats;
}

export async function statDirectory(dir: FileSystemDirectoryHandle): Promise<DirectoryStats> {
  let count = 0;
  let size = 0;
  let lastModified = 0;

  for await (const [, handle] of dir.entries()) {
    if (handle.kind !== 'file') {
      continue;
    }

    const file = await handle.getFile();

    count++;
    size += file.size;
    lastModified = Math.max(lastModified, file.lastModified);
  }

  return { count, size, lastModified };
}
