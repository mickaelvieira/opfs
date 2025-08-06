import { getParentDirectory, resolveFileFromPath } from './resolve';

/**
 * Remove a file from the file system.
 */
export async function removeFile(pathOrHandle: string | FileSystemFileHandle): Promise<boolean> {
  try {
    const file = typeof pathOrHandle === 'string' ? await resolveFileFromPath(pathOrHandle) : pathOrHandle;
    const directory = await getParentDirectory(file);

    await directory.removeEntry(file.name, { recursive: false });

    return true;
  } catch (error) {
    // ensure function's idempotency
    if (error instanceof DOMException && error.name === 'NotFoundError') {
      return true;
    }
    console.error(`The following error occurred while trying to remove file ${pathOrHandle}: ${error}`);
    return false;
  }
}
