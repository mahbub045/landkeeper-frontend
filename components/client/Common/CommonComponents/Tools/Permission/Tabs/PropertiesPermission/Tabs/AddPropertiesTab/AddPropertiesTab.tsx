'use client';
import Loading from '@/components/common/CustomLoader/Loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { AddPropertiesTabProps } from '@/types/client/Common/Tools/Permission/PropertiesPermissionTypes';
import { PAGE_LIMIT } from '@/utils/CommonConstants';
import { Check, X } from 'lucide-react';
import AddablePropertieCard from './AddablePropertyCard/AddablePropertyCard';

const getPageNumbers = (
  page: number,
  totalPages: number,
): (number | '...')[] => {
  const delta = 1;
  const range: (number | '...')[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - delta && i <= page + delta)
    ) {
      range.push(i);
    } else if (range[range.length - 1] !== '...') {
      range.push('...');
    }
  }

  return range;
};

const AddPropertiesTab: React.FC<AddPropertiesTabProps> = ({
  isLoadingAddable,
  userAlias,
  addableProperties,
  addableCount,
  addableTotalPages,
  addablePage,
  setAddablePage,
  selectedAliases,
  toggleProperty,
  toggleSelectAll,
  canEdit,
  setCanEdit,
  handleSubmit,
  isSaving,
  allSelected,
}) => {
  return (
    <>
      {isLoadingAddable && (
        <div className='grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-16 rounded-xl' />
          ))}
        </div>
      )}

      {!isLoadingAddable && userAlias && addableProperties.length > 0 && (
        <>
          <div className='flex items-center justify-end'>
            <Button size='sm' variant='outline' onClick={toggleSelectAll}>
              {allSelected ? (
                <span className='text-danger flex items-center gap-1'>
                  <X />
                  Clear all on this page
                </span>
              ) : (
                <span className='text-primary flex items-center gap-1'>
                  <Check />
                  Select all on this page
                </span>
              )}
            </Button>
          </div>

          {/* --- permission toggles + submit --- */}
          <div className='bg-primary/5 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg p-4 pb-4'>
            <Badge variant='success' className='gap-1.5 font-normal'>
              <Check className='h-3 w-3' strokeWidth={3} />
              Can view
              <span>(always granted)</span>
            </Badge>

            <div className='flex items-center gap-2.5'>
              <Switch
                id='can-edit'
                checked={canEdit}
                onCheckedChange={setCanEdit}
                className='bg-success/10 data-[state=checked]:bg-success border-success cursor-pointer'
              />
              <Label
                htmlFor='can-edit'
                className='cursor-pointer text-sm font-normal'
              >
                Can edit
              </Label>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={selectedAliases.length === 0 || isSaving}
              className='ml-auto'
            >
              {isSaving ? (
                <>
                  <Loading className='h-3.5 w-3.5 text-white!' />
                  Saving…
                </>
              ) : (
                `Apply to ${selectedAliases.length} selected`
              )}
            </Button>
          </div>

          <Separator />

          <div className='grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            {addableProperties.map((item) => {
              const alias = item.alias;
              const selected = selectedAliases.includes(alias);

              return (
                <AddablePropertieCard
                  key={alias}
                  item={item}
                  selected={selected}
                  toggleProperty={toggleProperty}
                />
              );
            })}
          </div>

          {/* --- pagination --- */}
          <div className='flex items-center justify-between'>
            {addableCount > 0 && (
              <p className='text-muted-foreground text-sm whitespace-nowrap'>
                Showing {(addablePage - 1) * PAGE_LIMIT + 1} to{' '}
                {Math.min(addablePage * PAGE_LIMIT, addableCount)} of{' '}
                {addableCount} Properties
              </p>
            )}
            {addableTotalPages > 1 && (
              <Pagination className='justify-end'>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        addablePage > 1 && setAddablePage((p) => p - 1)
                      }
                      aria-disabled={addablePage === 1}
                      className={
                        addablePage === 1
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>

                  {getPageNumbers(addablePage, addableTotalPages).map((p, i) =>
                    p === '...' ? (
                      <PaginationItem key={`addable-ellipsis-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={p}>
                        <PaginationLink
                          isActive={p === addablePage}
                          onClick={() => setAddablePage(p as number)}
                          className='cursor-pointer'
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        addablePage < addableTotalPages &&
                        setAddablePage((p) => p + 1)
                      }
                      aria-disabled={addablePage === addableTotalPages}
                      className={
                        addablePage === addableTotalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </>
      )}

      {!isLoadingAddable && userAlias && addableProperties.length === 0 && (
        <Card className='text-muted-foreground border-dashed p-8 text-center text-sm shadow-none'>
          This user already has access to every property.
        </Card>
      )}
    </>
  );
};

export default AddPropertiesTab;
