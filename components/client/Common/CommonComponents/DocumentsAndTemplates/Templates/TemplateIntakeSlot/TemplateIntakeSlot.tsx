import { Download, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

interface TemplateIntakeSlotProps {
  onFiles?: (files: FileList) => void;
}

const TemplateIntakeSlot: React.FC<TemplateIntakeSlotProps> = ({ onFiles }) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
    onFiles?.(files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  return (
    <div className='mb-12'>
      <div
        onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex cursor-pointer items-center gap-5 rounded-sm border-[1.5px] border-dashed px-6 py-8 transition-colors ${
          dragOver ? 'border-[#1E2A38] bg-[#1E2A38]/4' : 'border-[#D9D3C2]'
        }`}
      >
        <input
          ref={inputRef}
          type='file'
          accept='application/pdf'
          multiple
          className='hidden'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = '';
          }}
        />

        <div className='h-14 w-14 shrink-0'>
          <Download size={56} className='text-secondary' strokeWidth={1.4} />
        </div>

        <div className='min-w-0 flex-1'>
          <p className='text-secondary mb-1 text-[15px] font-medium'>
            Add a template to the catalog
          </p>
          <p className='text-[12px] text-[#5B6472]'>
            Drop a PDF here, or click to browse from your files.
          </p>
        </div>

        <span className='hidden shrink-0 items-center gap-1 rounded-sm bg-[#1E2A38] px-3 py-1.5 text-[11px] tracking-widest text-[#FBFAF6] uppercase sm:inline-flex'>
          <Upload size={12} strokeWidth={2} />
          Browse
        </span>
      </div>

      {selectedFiles.length > 0 && (
        <ul className='mt-3 space-y-1'>
          {selectedFiles.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className='truncate text-[12px] text-[#5B6472]'
            >
              {file.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TemplateIntakeSlot;
