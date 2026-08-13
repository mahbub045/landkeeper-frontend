import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

interface CopyOptions {
  successMessage?: string;
  errorMessage?: string;
}

export function useCopyToClipboard(resetDelay = 1500) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // `key` identifies WHICH button/row is copied (e.g. alias).
  // `text` is the actual value written to the clipboard (e.g. request_id).
  const copy = useCallback(
    async (
      key: string | undefined | null,
      text: string | number | undefined | null,
      options?: CopyOptions,
    ) => {
      if (!key || text === undefined || text === null) return;
      try {
        await navigator.clipboard.writeText(text.toString());
        setCopiedKey(key);
        if (options?.successMessage) toast.success(options.successMessage);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopiedKey(null), resetDelay);
      } catch (error) {
        toast.error(options?.errorMessage ?? 'Failed to copy to clipboard.');
      }
    },
    [resetDelay],
  );

  const isCopied = useCallback(
    (key?: string | null) => !!key && copiedKey === key,
    [copiedKey],
  );

  return { copy, isCopied };
}
