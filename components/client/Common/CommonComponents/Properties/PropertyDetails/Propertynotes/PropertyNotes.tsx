'use client';

import DetailsSection from '@/components/common/DetailsPage/DetailsSection';
import { PropertyNotesProps } from '@/types/client/Common/Properties/PropertyDetailsTypes';
import { StickyNote } from 'lucide-react';

const PropertyNotes: React.FC<PropertyNotesProps> = ({ notes }) => {
  if (!notes) return null;

  return (
    <DetailsSection title='Notes' icon={StickyNote}>
      <p className='text-muted-foreground text-sm leading-relaxed whitespace-pre-line'>
        {notes}
      </p>
    </DetailsSection>
  );
};

export default PropertyNotes;
