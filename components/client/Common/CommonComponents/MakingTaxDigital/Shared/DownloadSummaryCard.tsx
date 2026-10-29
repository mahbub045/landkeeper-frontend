'use client';

import { Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MTD_DOWNLOAD_EXTENSIONS } from '@/data/client/Common/MakingTaxDigital/MakingTaxDigitalData';
import { useDowloadMTDReportMutation } from '@/store/api/endpoints/client/Common/MakingTaxDigital/MakingTaxDigitalApi';
import {
  DownloadSummaryCardProps,
  MtdDeclarationCheck,
  MtdDeclarationForm,
} from '@/types/client/Common/MakingTaxDigital/MakingTaxDigitalTypes';
import { downloadBlob } from '@/utils/downloadBlob';
import { getTodayInputDate } from '@/utils/formatters';
import { IconBadge } from './MtdShared';

const DECLARATION_CHECKS: { key: MtdDeclarationCheck; label: string }[] = [
  {
    key: 'propertiesIncluded',
    label: 'I have included all relevant properties for this reporting period.',
  },
  {
    key: 'entriesChecked',
    label:
      'I have checked the income and expense entries and identified estimates or missing evidence.',
  },
  {
    key: 'itemsFlagged',
    label:
      'I have flagged unusual items, capital improvements, private costs and finance costs for review.',
  },
];

const EMPTY_DECLARATION: MtdDeclarationForm = {
  propertiesIncluded: false,
  entriesChecked: false,
  itemsFlagged: false,
  signatory: '',
  date: '',
  notes: '',
};

// Pulls a readable message out of a DRF-style error body:
// { detail }, { message }, { error } or { field: ['msg'] }
async function getApiErrorMessage(err: unknown): Promise<string | undefined> {
  let data = (err as { data?: unknown })?.data ?? err;
  // A file endpoint can hand back its error body as a Blob
  if (data instanceof Blob) {
    const text = await data.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (typeof data === 'string') return data || undefined;
  if (!data || typeof data !== 'object') return undefined;
  const body = data as Record<string, unknown>;
  for (const key of ['detail', 'message', 'error']) {
    if (typeof body[key] === 'string') return body[key] as string;
  }
  const [field, value] = Object.entries(body)[0] ?? [];
  const message = Array.isArray(value) ? value[0] : value;
  return typeof message === 'string' ? `${field}: ${message}` : undefined;
}

const DownloadSummaryCard: React.FC<DownloadSummaryCardProps> = ({
  report,
}) => {
  const [declaration, setDeclaration] =
    useState<MtdDeclarationForm>(EMPTY_DECLARATION);
  const setField = <K extends keyof MtdDeclarationForm>(
    key: K,
    value: MtdDeclarationForm[K],
  ) => setDeclaration((prev) => ({ ...prev, [key]: value }));
  const isDeclarationComplete =
    DECLARATION_CHECKS.every((check) => declaration[check.key]) &&
    [declaration.signatory, declaration.date, declaration.notes].every(
      (value) => value.trim() !== '',
    );

  const [downloadReport, { isLoading: isDownloading }] =
    useDowloadMTDReportMutation();

  async function handleDownload() {
    if (!report) return;
    try {
      const blob: Blob = await downloadReport({
        reportAlias: report.alias,
        payload: {
          confirmed_all_properties_included: declaration.propertiesIncluded,
          confirmed_entries_checked: declaration.entriesChecked,
          confirmed_items_flagged: declaration.itemsFlagged,
          confirmed_by_name: declaration.signatory.trim(),
          confirmed_at: declaration.date,
          review_notes: declaration.notes.trim(),
        },
      }).unwrap();

      const extension = MTD_DOWNLOAD_EXTENSIONS[blob.type] ?? 'pdf';
      downloadBlob(
        blob,
        `mtd-summary-${report.tax_year}-${report.quarter}.${extension}`,
      );
      toast.success('Summary downloaded.');
    } catch (err: unknown) {
      const message = await getApiErrorMessage(err);
      console.error('MTD summary download failed:', {
        status: (err as { status?: unknown })?.status,
        message,
        error: err,
      });
      toast.error(message ?? 'Failed to download summary. Please try again.');
    }
  }

  return (
    <Card className='border-border rounded-2xl shadow-md'>
      <CardContent className='space-y-4 px-5 py-4'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <IconBadge icon={Download} className='size-9' />
            <div>
              <p className='text-foreground text-sm font-semibold'>
                Download annual summary
              </p>
              <p className='text-muted-foreground text-xs'>
                Complete the declaration below to download your annual figures.
              </p>
            </div>
          </div>
          <Button
            disabled={!isDeclarationComplete || !report || isDownloading}
            onClick={handleDownload}
          >
            {isDownloading ? <Loading className='text-white!' /> : <Download />}
            Download summary
          </Button>
        </div>

        <div className='space-y-3'>
          {DECLARATION_CHECKS.map((check) => (
            <div key={check.key} className='flex items-start gap-3'>
              <Checkbox
                id={`mtd-declaration-${check.key}`}
                checked={declaration[check.key]}
                onCheckedChange={(checked) =>
                  setField(check.key, checked === true)
                }
                className='border-primary mt-0.5 cursor-pointer'
              />
              <Label
                htmlFor={`mtd-declaration-${check.key}`}
                className='cursor-pointer leading-snug font-normal'
              >
                {check.label}
              </Label>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <Field>
            <FieldLabel htmlFor='mtd-declaration-signatory' className='gap-0'>
              Landlord / authorised person
              <span className='text-danger'>*</span>
            </FieldLabel>
            <Input
              type='text'
              id='mtd-declaration-signatory'
              value={declaration.signatory}
              onChange={(e) => setField('signatory', e.target.value)}
              placeholder='Full name'
            />
          </Field>
          <Field>
            <FieldLabel htmlFor='mtd-declaration-date' className='gap-0'>
              Date<span className='text-danger'>*</span>
            </FieldLabel>
            <Input
              id='mtd-declaration-date'
              type='date'
              value={declaration.date}
              max={getTodayInputDate()}
              onChange={(e) => setField('date', e.target.value)}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor='mtd-declaration-notes' className='gap-0'>
            Notes<span className='text-danger'>*</span>
          </FieldLabel>
          <Textarea
            id='mtd-declaration-notes'
            value={declaration.notes}
            onChange={(e) => setField('notes', e.target.value)}
            placeholder='Add any notes for your accountant or records'
            rows={3}
          />
        </Field>
      </CardContent>
    </Card>
  );
};

export default DownloadSummaryCard;
