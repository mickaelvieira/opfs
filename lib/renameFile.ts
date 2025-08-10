export async function renameFile(
  parentDir: FileSystemDirectoryHandle,
  oldName: string,
  newName: string
): Promise<void> {
  try {
    // Get the original file
    const oldFileHandle = await parentDir.getFileHandle(oldName);
    const file = await oldFileHandle.getFile();

    // Create new file with new name
    const newFileHandle = await parentDir.getFileHandle(newName, { create: true });
    const writable = await newFileHandle.createWritable();

    // Copy content to new file
    await writable.write(file);
    await writable.close();

    // Delete the old file
    await parentDir.removeEntry(oldName);

    console.log(`File renamed from "${oldName}" to "${newName}"`);
  } catch (error) {
    console.error('Failed to rename file:', error);
    throw error;
  }
}
