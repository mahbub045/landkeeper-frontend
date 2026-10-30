'use client';

import { FileText, Landmark, Pencil } from 'lucide-react';
import { useState } from 'react';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getReportScopeLabel } from '@/data/client/Common/MakingTaxDigital/MakingTaxDigitalData';
import { useGetMTDFinanceCostsQuery } from '@/store/api/endpoints/client/Common/MakingTaxDigital/MakingTaxDigitalApi';
import {
  MtdFinanceCostItem,
  MtdReportTabProps,
} from '@/types/client/Common/MakingTaxDigital/MakingTaxDigitalTypes';
import EditFinanceCostDialog from '../Dialogs/EditFinanceCostDialog';
import {
  HelpfulInfo,
  SectionCard,
  TableFrame,
  toAmount,
} from '../Shared/MtdShared';

const FinanceCostsTab: React.FC<MtdReportTabProps> = ({
  report,
  onPending,
}) => {
  const { data, isFetching } = useGetMTDFinanceCostsQuery(
    { reportAlias: report?.alias },
    { skip: !report },
  );
  const financeCosts: MtdFinanceCostItem[] = data?.finance_costs ?? [];

  // One property needs no per-row property column
  const showProperty = (report?.number_of_properties_included ?? 0) > 1;
  const columnCount = showProperty ? 6 : 5;

  const [editing, setEditing] = useState<MtdFinanceCostItem | null>(null);

  return (
    <div className='space-y-4'>
      <div className='space-y-4'>
        <SectionCard
          icon={Landmark}
          title='Finance costs'
          description={`Finance costs recorded for ${getReportScopeLabel(report)}.`}
        >
          <TableFrame>
            <Table>
              <TableHeader>
                <TableRow>
                  {showProperty && <TableHead>Property</TableHead>}
                  <TableHead>Lender</TableHead>
                  <TableHead>Monthly payment (£)</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Evidence</TableHead>
                  <TableHead className='text-center'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetching ? (
                  <TableRow>
                    <TableCell colSpan={columnCount}>
                      <div className='flex justify-center py-6'>
                        <Loading />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : financeCosts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columnCount}
                      className='text-muted-foreground py-6 text-center'
                    >
                      No finance costs recorded for this quarter.
                    </TableCell>
                  </TableRow>
                ) : (
                  financeCosts.map((cost) => (
                    <TableRow key={cost.alias}>
                      {showProperty && (
                        <TableCell className='text-foreground font-medium'>
                          {cost.property_name}
                        </TableCell>
                      )}
                      <TableCell>{cost.lender_name}</TableCell>
                      <TableCell className='tabular-nums'>
                        {cost.monthly_payment === null
                          ? '—'
                          : toAmount(cost.monthly_payment)}
                      </TableCell>
                      <TableCell className='max-w-40 whitespace-normal'>
                        {cost.notes || '—'}
                      </TableCell>
                      <TableCell className='max-w-56 whitespace-normal'>
                        {cost.evidence.length === 0 ? (
                          <span className='text-muted-foreground'>—</span>
                        ) : (
                          <div className='flex flex-wrap gap-1'>
                            {cost.evidence.map((file) => (
                              <span
                                key={file.id}
                                title={file.name}
                                className='border-border bg-muted/50 inline-flex max-w-full items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs'
                              >
                                <FileText className='text-muted-foreground size-3 shrink-0' />
                                <span className='truncate'>{file.name}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className='space-x-1 text-center whitespace-nowrap'>
                        <Button
                          variant='default'
                          size='icon-sm'
                          aria-label='Edit'
                          onClick={() => setEditing(cost)}
                        >
                          <Pencil />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableFrame>
        </SectionCard>
      </div>

      <div className='space-y-4'>
        <HelpfulInfo
          items={[
            'Record mortgage interest and other finance costs separately for each property.',
            'Residential finance costs can receive different tax treatment from ordinary expenses.',
            'Keep UK and overseas property finance costs separate where required.',
            <>
              Have{' '}
              <strong className='text-foreground'>supporting evidence</strong>{' '}
              for all finance costs (mortgage statements, lender letters, etc.).
            </>,
          ]}
        />
      </div>

      <EditFinanceCostDialog
        reportAlias={report?.alias}
        financeCost={editing}
        open={!!editing}
        onClose={() => setEditing(null)}
      />
    </div>
  );
};

export default FinanceCostsTab;
