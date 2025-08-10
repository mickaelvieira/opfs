/**
 * Move a file from one directory to another
 */
export async function moveFile(
  sourceDir: FileSystemDirectoryHandle,
  targetDir: FileSystemDirectoryHandle,
  fileName: string,
  newFileName?: string
): Promise<void> {
  const finalFileName = newFileName || fileName;

  try {
    // Check if target file already exists
    try {
      await targetDir.getFileHandle(finalFileName);
      throw new Error(`File "${finalFileName}" already exists in target directory`);
    } catch {
      // Good, file doesn't exist in target
    }

    // Get source file
    const sourceFileHandle = await sourceDir.getFileHandle(fileName);
    const file = await sourceFileHandle.getFile();

    // Create target file
    const targetFileHandle = await targetDir.getFileHandle(finalFileName, { create: true });
    const writable = await targetFileHandle.createWritable();

    // Stream content for memory efficiency
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

    // Delete source file
    await sourceDir.removeEntry(fileName);

    console.log(`File moved from "${fileName}" to "${finalFileName}"`);
  } catch (error) {
    console.error('Failed to move file:', error);
    throw error;
  }
}
