import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUploadTemplateMutation } from '@/store/api/endpoints/client/Common/DocumentsAndTemplates/TemplatesApi';
import {
  AlertCircle,
  CheckCircle2,
  CloudUpload,
  File,
  Upload,
  X,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

interface UploadTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UploadTemplateDialog: React.FC<UploadTemplateDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [uploadFile, { isLoading, isSuccess, isError, reset }] =
    useUploadTemplateMutation();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetForm = useCallback(() => {
    setFile(null);
    setTitle('');
    setCategory('');
    setIsDragging(false);
    reset();
  }, [reset]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  };

  const handleFileSelect = (selected: FileList | null) => {
    if (!selected || selected.length === 0) return;
    const selectedFile = selected[0];
    if (selectedFile.type !== 'application/pdf') return;
    setFile(selectedFile);
    setTitle((prev) => prev || selectedFile.name.replace(/\.pdf$/i, ''));
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim() || !category.trim()) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title.trim());
    formData.append('category', category.trim());

    try {
      await uploadFile(formData).unwrap();
      setTimeout(() => {
        resetForm();
        onOpenChange(false);
      }, 800);
    } catch {
      // isError from the mutation state handles surfacing this
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='flex max-h-[90vh] w-full flex-col overflow-hidden sm:max-w-185'>
        <DialogHeader>
          <DialogTitle className='text-foreground text-xl font-bold'>
            Upload Template
          </DialogTitle>
          <DialogDescription>
            Add new templates for your property.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4 overflow-hidden'
        >
          <div className='flex flex-col gap-4 overflow-y-auto px-1'>
            <Input
              ref={inputRef}
              type='file'
              accept='application/pdf'
              required
              className='hidden'
              onChange={(e) => handleFileSelect(e.target.files)}
            />

            {!file ? (
              <button
                type='button'
                onClick={() => inputRef.current?.click()}
                onDragOver={(e: React.DragEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative flex w-full cursor-pointer items-center gap-5 rounded-sm border-[1.5px] border-dashed px-6 py-8 text-left transition-colors ${
                  isDragging
                    ? 'border-primary bg-[#FAFAF8] dark:bg-[#22262C]'
                    : 'hover:border-primary border-[#D8DCE3] hover:bg-[#FAFAF8] dark:border-[#3A3F47] dark:hover:bg-[#22262C]'
                } focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none`}
              >
                <div className='h-14 w-14 shrink-0'>
                  <CloudUpload
                    size={56}
                    className='text-secondary'
                    strokeWidth={1.4}
                  />
                </div>

                <div className='min-w-0 flex-1 text-left'>
                  <p className='text-secondary mb-1 text-[15px] font-medium'>
                    Add a template to the catalog
                    <span className='text-danger'>*</span>
                  </p>
                  <p className='text-[12px] text-[#5B6472]'>
                    Drop a PDF here, or click to browse from your files.
                  </p>
                </div>

                <span className='bg-primary hidden shrink-0 items-center gap-1 rounded-sm px-3 py-1.5 text-[11px] tracking-widest text-[#FBFAF6] uppercase sm:inline-flex'>
                  <Upload size={12} strokeWidth={2} />
                  Browse
                </span>
              </button>
            ) : (
              <div className='border-secondary flex items-center gap-3 rounded-sm border p-4'>
                <File
                  size={28}
                  className='text-secondary shrink-0'
                  strokeWidth={1.6}
                />
                <div className='min-w-0 flex-1'>
                  <p className='text-primary truncate text-[14px] font-medium'>
                    {file.name}
                  </p>
                  <p className='text-[12px] text-[#5B6472]'>
                    {(file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => setFile(null)}
                  className='text-secondary shrink-0 hover:opacity-70'
                  aria-label='Remove file'
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='title' className='text-[13px]'>
                Title<span className='text-danger'>*</span>
              </Label>
              <Input
                id='title'
                type='text'
                required
                placeholder='e.g. Standard Lease Agreement'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='category' className='text-[13px]'>
                Category<span className='text-danger'>*</span>
              </Label>
              <Input
                id='category'
                type='text'
                required
                placeholder='e.g. Lease Agreement'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            {isError && (
              <div className='bg-destructive/10 text-destructive flex items-center gap-2 rounded-sm px-3 py-2 text-[13px]'>
                <AlertCircle size={14} />
                Upload failed. Please try again.
              </div>
            )}

            {isSuccess && (
              <div className='flex items-center gap-2 rounded-sm bg-green-500/10 px-3 py-2 text-[13px] text-green-600'>
                <CheckCircle2 size={14} />
                Template uploaded successfully.
              </div>
            )}
          </div>

          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type='submit' variant='default' disabled={isLoading}>
              {isLoading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadTemplateDialog;
