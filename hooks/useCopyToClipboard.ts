import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

export function useCopyToClipboard(resetDelay = 1500) {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (text?: string | null) => {
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        setCopiedValue(text);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopiedValue(null), resetDelay);
      } catch (error) {
        toast.error('Failed to copy to clipboard.');
      }
    },
    [resetDelay],
  );

  return {
    copy,
    copiedValue,
    isCopied: (text?: string | null) => !!text && copiedValue === text,
  };
}
