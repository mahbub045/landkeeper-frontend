import { DetailsRecordHistoryProps } from '@/types/common/DetailsPage/DetailsPageTypes';
import { formatDate } from '@/utils/formatters';
import { CalendarClock, CalendarPlus, History } from 'lucide-react';
import DetailsInfoItem from './DetailsInfoItem';
import DetailsSection from './DetailsSection';

const DetailsRecordHistory: React.FC<DetailsRecordHistoryProps> = ({
  createdAt,
  updatedAt,
}) => {
  const items = [
    { icon: CalendarPlus, label: 'Created on', value: formatDate(createdAt) },
    {
      icon: CalendarClock,
      label: 'Last updated',
      value: formatDate(updatedAt),
    },
  ];

  return (
    <DetailsSection title='Record History' icon={History}>
      <dl className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        {items.map((item) => (
          <DetailsInfoItem
            key={item.label}
            {...item}
            className='bg-muted/40 items-center rounded-xl p-3'
          />
        ))}
      </dl>
    </DetailsSection>
  );
};

export default DetailsRecordHistory;
