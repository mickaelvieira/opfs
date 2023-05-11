function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) {
    return '0 Bytes';
  }

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (i == 0) {
    return bytes + ' ' + sizes[i];
  }

  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}

/**
 * Returns statistics about the storage.
 */
export async function statistics() {
  const estimate = await navigator.storage.estimate();
  const { usage = 0, quota = 0 } = estimate;
  const percent = quota === 0 ? 0 : ((usage / quota) * 100).toFixed(2);

  return {
    percent: `${percent}%`,
    usage: formatBytes(usage),
    quota: formatBytes(quota),
  };
}
