import { moveFile } from './moveFile';

/**
 * Move a directory from one location to another
 */
export async function moveDirectory(
  sourceParentDir: FileSystemDirectoryHandle,
  targetParentDir: FileSystemDirectoryHandle,
  directoryName: string,
  newDirectoryName?: string
): Promise<void> {
  const finalDirectoryName = newDirectoryName || directoryName;

  try {
    // Check if target directory already exists
    try {
      await targetParentDir.getDirectoryHandle(finalDirectoryName);
      throw new Error(`Directory "${finalDirectoryName}" already exists in target location`);
    } catch {
      // Good, directory doesn't exist in target
    }

    // Get source directory
    const sourceDirHandle = await sourceParentDir.getDirectoryHandle(directoryName);

    // Create target directory
    const targetDirHandle = await targetParentDir.getDirectoryHandle(finalDirectoryName, { create: true });

    // Recursively copy all contents
    await copyDirectoryContents(sourceDirHandle, targetDirHandle);

    // Delete source directory
    await sourceParentDir.removeEntry(directoryName, { recursive: true });

    console.log(`Directory moved from "${directoryName}" to "${finalDirectoryName}"`);
  } catch (error) {
    console.error('Failed to move directory:', error);
    throw error;
  }
}

/**
 * Move multiple files at once
 */
export async function moveFiles(
  sourceDir: FileSystemDirectoryHandle,
  targetDir: FileSystemDirectoryHandle,
  fileNames: string[],
  progressCallback?: (current: number, total: number) => void
): Promise<{ success: string[]; failed: Array<{ name: string; error: string }> }> {
  const results = {
    success: [] as string[],
    failed: [] as Array<{ name: string; error: string }>,
  };

  for (let i = 0; i < fileNames.length; i++) {
    const fileName = fileNames[i];

    try {
      await moveFile(sourceDir, targetDir, fileName);
      results.success.push(fileName);
    } catch (error) {
      results.failed.push({
        name: fileName,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    progressCallback?.(i + 1, fileNames.length);
  }

  return results;
}

/**
 * Copy directory contents recursively
 */
export async function copyDirectoryContents(
  sourceDir: FileSystemDirectoryHandle,
  targetDir: FileSystemDirectoryHandle
): Promise<void> {
  for await (const [name, handle] of sourceDir.entries()) {
    if (handle.kind === 'file') {
      const file = await handle.getFile();
      const newFileHandle = await targetDir.getFileHandle(name, { create: true });
      const writable = await newFileHandle.createWritable();

      // Use streaming for large files
      const reader = file.stream().getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          await writable.write(value);
        }
      } finally {
        reader.releaseLock();
        await writable.close();
      }
    } else {
      // Recursively copy subdirectory
      const newSubDir = await targetDir.getDirectoryHandle(name, { create: true });
      await copyDirectoryContents(handle, newSubDir);
    }
  }
}

/**
 * Move thumbnail in cache
 */
export async function moveThumbnailInCache(oldName: string, newName: string): Promise<void> {
  try {
    const opfsRoot = await navigator.storage.getDirectory();
    const thumbnailDir = await opfsRoot.getDirectoryHandle('thumbnails');

    // Find and move thumbnail files that match the old name pattern
    for await (const [filename, handle] of thumbnailDir.entries()) {
      if (handle.kind === 'file' && filename.startsWith(oldName)) {
        const newFilename = filename.replace(oldName, newName);

        // Move thumbnail file
        const file = await handle.getFile();
        const newFileHandle = await thumbnailDir.getFileHandle(newFilename, { create: true });
        const writable = await newFileHandle.createWritable();
        await writable.write(file);
        await writable.close();

        // Delete old thumbnail
        await thumbnailDir.removeEntry(filename);
      }
    }
  } catch {
    // Thumbnail cache might not exist, that's okay
  }
}

/**
 * Utility functions for file name handling
 */
export function removeExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex === -1 ? filename : filename.substring(0, lastDotIndex);
}

export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex === -1 ? '' : filename.substring(lastDotIndex + 1);
}

/**
 * Check if a file or directory exists
 */
async function exists(
  dir: FileSystemDirectoryHandle,
  name: string,
  kind: 'file' | 'directory' = 'file'
): Promise<boolean> {
  try {
    if (kind === 'file') {
      await dir.getFileHandle(name);
    } else {
      await dir.getDirectoryHandle(name);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Get available name if target already exists
 */
export async function getAvailableName(
  dir: FileSystemDirectoryHandle,
  baseName: string,
  extension?: string,
  kind: 'file' | 'directory' = 'file'
): Promise<string> {
  let counter = 1;
  let testName = extension ? `${baseName}.${extension}` : baseName;

  while (await exists(dir, testName, kind)) {
    if (extension) {
      testName = `${baseName} (${counter}).${extension}`;
    } else {
      testName = `${baseName} (${counter})`;
    }
    counter++;
  }

  return testName;
}
