export function normalize(path: string): string {
  return path.trim().replace(/\/+/g, '/').replace(/^\//, '').replace(/\/$/, '');
}

export function basename(path: string): string {
  return directories(path).pop() || '';
}

export function dirname(path: string): string {
  return directories(path).slice(0, -1).join('/') || '';
}

export function directories(path: string): string[] {
  return path
    .split('/')
    .map((dir) => dir.trim())
    .filter((dir) => dir !== '');
}

export function isFileHandle(handle: FileSystemHandle): handle is FileSystemFileHandle {
  return handle.kind === 'file';
}

export function isDirectoryHandle(handle: FileSystemHandle): handle is FileSystemDirectoryHandle {
  return handle.kind === 'directory';
}
