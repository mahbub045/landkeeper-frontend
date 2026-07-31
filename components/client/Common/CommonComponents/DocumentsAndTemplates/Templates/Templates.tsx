'use client';
import { Download, FolderOpen, Pencil, Trash2, Upload } from 'lucide-react';
import React, { useRef, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

// ---- types ---------------------------------------------------------
interface Template {
  id: string;
  title: string;
  category: string;
  size: string;
  date: string;
  uses: number;
}

interface Draft {
  title: string;
  category: string;
}

// ---- seed data ---------------------------------------------------------
const CATEGORIES = ['Contracts', 'Invoices', 'Reports', 'Letters', 'Forms'];

const seedTemplates: Template[] = [
  {
    id: 't1',
    title: 'Master Services Agreement',
    category: 'Contracts',
    size: '184 KB',
    date: '2026.03.11',
    uses: 212,
  },
  {
    id: 't2',
    title: 'Standard Invoice — Net 30',
    category: 'Invoices',
    size: '96 KB',
    date: '2026.05.02',
    uses: 458,
  },
  {
    id: 't3',
    title: 'Quarterly Board Report',
    category: 'Reports',
    size: '1.2 MB',
    date: '2026.01.28',
    uses: 67,
  },
  {
    id: 't4',
    title: 'Client Onboarding Letter',
    category: 'Letters',
    size: '44 KB',
    date: '2026.06.19',
    uses: 130,
  },
  {
    id: 't5',
    title: 'Vendor Intake Form',
    category: 'Forms',
    size: '72 KB',
    date: '2026.04.07',
    uses: 89,
  },
  {
    id: 't6',
    title: 'Non-Disclosure Agreement',
    category: 'Contracts',
    size: '112 KB',
    date: '2026.02.14',
    uses: 301,
  },
];

// tiny valid PDF so downloads actually produce a file
function makeDummyPdfBlob(title: string): Blob {
  const text = `Template: ${title}`;
  const pdf = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 150]/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>endobj
4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
5 0 obj<</Length ${text.length + 40}>>stream
BT /F1 14 Tf 20 100 Td (${text}) Tj ET
endstream
endobj
xref
0 6
trailer<</Size 6/Root 1 0 R>>
startxref
0
%%EOF`;
  return new Blob([pdf], { type: 'application/pdf' });
}

interface TemplateCardProps {
  tpl: Template;
  onDownload: (tpl: Template) => void;
  onEdit: (tpl: Template) => void;
  onDelete: (id: string) => void;
}

function TemplateCard({
  tpl,
  onDownload,
  onEdit,
  onDelete,
}: TemplateCardProps) {
  return (
    <div className='relative'>
      {/* stacked-paper effect */}
      <div className='absolute inset-0 translate-x-0.75 translate-y-0.75 rounded-sm border border-[#E6E1D2] bg-[#FBFAF6]' />
      <div className='absolute inset-0 translate-x-[1.5px] translate-y-[1.5px] rounded-sm border border-[#E6E1D2] bg-[#FBFAF6]' />

      <div className='relative flex h-full min-h-47.5 flex-col justify-between rounded-sm border border-[#D9D3C2] bg-[#FBFAF6] p-5 transition-shadow hover:shadow-[0_10px_24px_-14px_rgba(30,42,56,0.35)]'>
        <div>
          <div className='mb-4 flex items-start justify-between gap-3'>
            <Badge
              variant='outline'
              className='-rotate-2 rounded-sm border-[#A67C3D] bg-[#A67C3D]/6 px-2.5 py-1 text-[10px] tracking-[0.14em] text-[#8B6530] uppercase'
            >
              {tpl.category}
            </Badge>

            <div className='flex items-center gap-1'>
              <Button
                variant='ghost'
                size='icon'
                className='h-7 w-7 text-[#5B6472] hover:bg-[#1E2A38]/6 hover:text-[#1E2A38]'
                onClick={() => onEdit(tpl)}
              >
                <Pencil size={13} strokeWidth={1.8} />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-7 w-7 text-[#5B6472] hover:bg-red-50 hover:text-red-600'
                  >
                    <Trash2 size={13} strokeWidth={1.8} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className=''>
                      Remove this template?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      `{tpl.title}` will be removed from the catalog. This
                      can&rsquo;t be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className='bg-red-600 hover:bg-red-700'
                      onClick={() => onDelete(tpl.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <h3 className='mb-1 text-[17px] leading-snug font-medium text-[#1E2A38]'>
            {tpl.title}
          </h3>
          <p className='text-[11px] tracking-wide text-[#5B6472]'>
            {tpl.size} · {tpl.date} · {tpl.uses} downloads
          </p>
        </div>

        <Button
          onClick={() => onDownload(tpl)}
          size='sm'
          className='mt-4 gap-2 self-start rounded-sm bg-[#1E2A38] text-[12px] text-[#FBFAF6] hover:bg-[#1E2A38]/90'
        >
          <Download size={13} strokeWidth={2} />
          Download PDF
        </Button>
      </div>
    </div>
  );
}

interface IntakeSlotProps {
  onFiles: (files: FileList) => void;
}

function IntakeSlot({ onFiles }: IntakeSlotProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) onFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative flex cursor-pointer items-center gap-5 rounded-sm border-[1.5px] border-dashed px-6 py-8 transition-colors ${
        dragOver
          ? 'border-[#1E2A38] bg-[#1E2A38]/4'
          : 'border-[#D9D3C2] bg-[#FBFAF6]'
      }`}
    >
      <input
        ref={inputRef}
        type='file'
        accept='application/pdf'
        multiple
        className='hidden'
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          e.target.files?.length && onFiles(e.target.files)
        }
      />

      <div className='h-14 w-14 shrink-0'>
        <svg viewBox='0 0 56 56' fill='none'>
          <rect
            x='1'
            y='1'
            width='54'
            height='54'
            rx='4'
            stroke='#1E2A38'
            strokeWidth='1.2'
          />
          <line
            x1='14'
            y1='28'
            x2='42'
            y2='28'
            stroke='#A67C3D'
            strokeWidth='2.5'
            strokeLinecap='round'
          />
          <path
            d='M28 14 L28 30 M22 24 L28 30 L34 24'
            stroke='#1E2A38'
            strokeWidth='1.6'
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
          />
        </svg>
      </div>

      <div className='min-w-0 flex-1'>
        <p className='mb-1 text-[15px] font-medium text-[#1E2A38]'>
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
  );
}

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>(seedTemplates);
  const [editing, setEditing] = useState<Template | null>(null); // template being edited
  const [draft, setDraft] = useState<Draft>({ title: '', category: '' });

  const handleFiles = (fileList: FileList) => {
    const files = Array.from(fileList).filter(
      (f) => f.type === 'application/pdf' || f.name.endsWith('.pdf'),
    );
    if (!files.length) {
      toast.error('Only PDF files can be added.');
      return;
    }
    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(
      today.getDate(),
    ).padStart(2, '0')}`;

    const newEntries: Template[] = files.map((f, i) => ({
      id: `u-${Date.now()}-${i}`,
      title: f.name.replace(/\.pdf$/i, ''),
      category: 'Forms',
      size: `${Math.max(1, Math.round(f.size / 1024))} KB`,
      date: dateStr,
      uses: 0,
    }));

    setTemplates((prev) => [...newEntries, ...prev]);
    toast.success(
      `${files.length} template${files.length > 1 ? 's' : ''} added.`,
    );
  };

  const handleDownload = (tpl: Template) => {
    const blob = makeDummyPdfBlob(tpl.title);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tpl.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const openEdit = (tpl: Template) => {
    setEditing(tpl);
    setDraft({ title: tpl.title, category: tpl.category });
  };

  const saveEdit = () => {
    if (!editing) return;
    if (!draft.title.trim()) {
      toast.error("Title can't be empty.");
      return;
    }
    const editingId = editing.id;
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === editingId
          ? { ...t, title: draft.title.trim(), category: draft.category }
          : t,
      ),
    );
    toast.success('Template updated.');
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    toast.success('Template removed.');
  };

  return (
    <div className='mb-4 min-h-screen w-full'>
      <div>
        {/* header */}
        <div className='mb-1 flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className='mb-2 text-[11px] tracking-[0.18em] text-[#8B6530] uppercase'>
              Document Catalog
            </p>
            <h1 className='text-[38px] leading-none font-semibold text-[#1E2A38]'>
              Template Library
            </h1>
          </div>
          <p className='pb-1 text-[12px] text-[#5B6472]'>
            {templates.length} files indexed
          </p>
        </div>

        <div className='mb-8 h-px w-full bg-[#D9D3C2]' />

        {/* upload */}
        <div className='mb-12'>
          <IntakeSlot onFiles={handleFiles} />
        </div>

        {/* grid */}
        {templates.length ? (
          <div className='grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3'>
            {templates.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                tpl={tpl}
                onDownload={handleDownload}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center rounded-sm border border-dashed border-[#D9D3C2] py-20 text-center'>
            <FolderOpen
              size={28}
              className='text-[#5B6472]'
              strokeWidth={1.4}
            />
            <p className='mt-3 text-[14px] text-[#1E2A38]'>No templates yet.</p>
            <p className='mt-1 text-[12px] text-[#5B6472]'>
              Add one using the panel above.
            </p>
          </div>
        )}
      </div>

      {/* edit dialog */}
      <Dialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className=''>Edit template</DialogTitle>
          </DialogHeader>

          <div className='space-y-4 py-2'>
            <div className='space-y-1.5'>
              <Label htmlFor='tpl-title'>Title</Label>
              <Input
                id='tpl-title'
                value={draft.title}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, title: e.target.value }))
                }
              />
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='tpl-category'>Category</Label>
              <Select
                value={draft.category}
                onValueChange={(v) => setDraft((d) => ({ ...d, category: v }))}
              >
                <SelectTrigger id='tpl-category'>
                  <SelectValue placeholder='Select a category' />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              className='bg-[#1E2A38] hover:bg-[#1E2A38]/90'
              onClick={saveEdit}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Templates;
