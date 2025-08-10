export async function renameDirectory(
  parentDir: FileSystemDirectoryHandle,
  oldName: string,
  newName: string
): Promise<void> {
  try {
    // Get the original directory
    const oldDirHandle = await parentDir.getDirectoryHandle(oldName);

    // Create new directory with new name
    const newDirHandle = await parentDir.getDirectoryHandle(newName, { create: true });

    // Recursively copy all contents
    await copyDirectoryContents(oldDirHandle, newDirHandle);

    // Delete the old directory
    await parentDir.removeEntry(oldName, { recursive: true });

    console.log(`Directory renamed from "${oldName}" to "${newName}"`);
  } catch (error) {
    console.error('Failed to rename directory:', error);
    throw error;
  }
}

async function copyDirectoryContents(
  sourceDir: FileSystemDirectoryHandle,
  targetDir: FileSystemDirectoryHandle
): Promise<void> {
  for await (const [name, handle] of sourceDir.entries()) {
    if (handle.kind === 'file') {
      // Copy file
      const file = await handle.getFile();
      const newFileHandle = await targetDir.getFileHandle(name, { create: true });
      const writable = await newFileHandle.createWritable();
      await writable.write(file);
      await writable.close();
    } else {
      // Copy directory recursively
      const newSubDir = await targetDir.getDirectoryHandle(name, { create: true });
      await copyDirectoryContents(handle, newSubDir);
    }
  }
}
