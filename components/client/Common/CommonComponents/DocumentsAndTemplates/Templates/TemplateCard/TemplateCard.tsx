import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Pencil, Trash2 } from 'lucide-react';

export interface Template {
  id: string;
  title: string;
  category: string;
  size: string;
  date: string;
  uses: number;
}

// ---- seed data ---------------------------------------------------------
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

const TemplateCard: React.FC = () => {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {seedTemplates.map((tpl) => (
        <div key={tpl.id} className='relative'>
          {/* stacked-paper effect */}
          <div className='border-secondary absolute inset-0 translate-x-0.75 translate-y-0.75 rounded-sm border' />
          <div className='border-secondary absolute inset-0 translate-x-[1.1px] translate-y-[1.1px] rounded-sm border' />

          <div className='relative flex h-full min-h-47.5 flex-col justify-between rounded-sm p-5 transition-shadow hover:shadow-[0_10px_24px_-14px_rgba(30,42,56,0.35)]'>
            <div>
              <div className='mb-4 flex items-start justify-between gap-3'>
                <Badge
                  variant='outline'
                  className='border-secondary text-primary -rotate-2 rounded-sm bg-[#A67C3D]/6 px-2.5 py-1 text-[10px] tracking-[0.14em] uppercase'
                >
                  {tpl.category}
                </Badge>

                <div className='flex items-center gap-1'>
                  <Button variant='outline' size='icon'>
                    <Pencil size={13} strokeWidth={1.8} />
                  </Button>

                  <Button variant='destructive' size='icon'>
                    <Trash2 size={13} strokeWidth={1.8} />
                  </Button>
                </div>
              </div>

              <h3 className='text-primary mb-1 line-clamp-2 text-[17px] leading-snug font-medium'>
                {tpl.title}
              </h3>
              <p className='text-[11px] tracking-wide text-[#5B6472]'>
                {tpl.size} · {tpl.date} · {tpl.uses} downloads
              </p>
            </div>

            <Button
              onClick={() => handleDownload(tpl)}
              size='sm'
              className='mt-2 gap-2 self-start rounded-sm bg-[#1E2A38] text-[12px] text-[#FBFAF6] hover:bg-[#1E2A38]/90'
            >
              <Download size={13} strokeWidth={2} />
              Download PDF
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateCard;
