// hooks/useDownloadFile.ts
import { useCallback, useState } from 'react';

type DownloadFileParams = {
  url: string;
  filename: string;
};

export const useDownloadFile = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadFile = useCallback(
    async ({ url, filename }: DownloadFileParams) => {
      setIsDownloading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/fetch-remote-files?url=${encodeURIComponent(url)}`,
        );
        if (!response.ok) throw new Error('Failed to fetch file');

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(objectUrl);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Download failed';
        setError(message);
        console.error('Error downloading file:', err);
      } finally {
        setIsDownloading(false);
      }
    },
    [],
  );

  return { downloadFile, isDownloading, error };
};
