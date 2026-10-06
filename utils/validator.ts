export function validateDocumentStep(files: File[]): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!files || files.length === 0)
    errors.file = 'Please upload at least one document.';
  return errors;
}
