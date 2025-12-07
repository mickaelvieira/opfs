import { resolveFileFromPath } from "./resolve";

/**
 * Returns a File object for the given path.
 */
export async function readFile(pathOrHandle: string | FileSystemFileHandle): Promise<ArrayBuffer> {
  const handle =
    typeof pathOrHandle === "string" ? await resolveFileFromPath(pathOrHandle) : pathOrHandle;

  const file = await handle.getFile();
  return file.arrayBuffer();
}
