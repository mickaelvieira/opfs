import { chdir } from './chdir';
import { getParentDirectory } from './resolve';

/**
 * Removes a directory and all its contents.
 */
export async function rmdir(pathOrHandle: string | FileSystemDirectoryHandle): Promise<boolean> {
  try {
    const directory = typeof pathOrHandle === 'string' ? await chdir(pathOrHandle) : pathOrHandle;
    const parent = await getParentDirectory(directory);
    await parent.removeEntry(directory.name, { recursive: true });

    return true;
  } catch (error) {
    // ensure function's idempotency
    if (error instanceof DOMException && error.name === 'NotFoundError') {
      return true;
    }
    console.error(`The following error occured while trying to remove directory ${pathOrHandle}: ${error}`);
    return false;
  }
}
