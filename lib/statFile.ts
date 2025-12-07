import { resolveFileFromPath } from "./resolve";

/**
 * Returns a File object for the given path.
 */
export async function statFile(filepath: string): Promise<File> {
  const handle = await resolveFileFromPath(filepath);
  const file = await handle.getFile();
  return file;
}
