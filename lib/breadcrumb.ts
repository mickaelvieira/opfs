import { directories, normalize } from "./path";

/**
 * Returns a handle to the last directory in the path.
 */
export async function breadcrumb(
  pathOrHandle: string | FileSystemDirectoryHandle,
): Promise<FileSystemDirectoryHandle[]> {
  const crumbs: FileSystemDirectoryHandle[] = [];
  const root = await navigator.storage.getDirectory();

  let dirs: string[] = [];
  if (typeof pathOrHandle === "string") {
    dirs = directories(normalize(pathOrHandle));
  } else {
    const path = await root.resolve(pathOrHandle);
    if (path) {
      dirs = path;
    }
  }

  crumbs.push(root);

  let parent = root;
  for (const dir of dirs) {
    const child = await parent.getDirectoryHandle(dir);
    crumbs.push(child);
    parent = child;
  }

  return crumbs;
}
