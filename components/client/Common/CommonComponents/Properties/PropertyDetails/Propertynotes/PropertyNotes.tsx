'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyNotesProps } from '@/types/client/Common/Properties/PropertyDetailsTypes';

const PropertyNotes: React.FC<PropertyNotesProps> = ({ notes }) => {
  if (!notes) return null;

  return (
    <Card className='border-border rounded-2xl shadow-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-base font-semibold'>Notes</CardTitle>
      </CardHeader>
      <CardContent className='px-5 pb-5'>
        <p className='text-muted-foreground text-sm leading-relaxed whitespace-pre-line'>
          {notes}
        </p>
      </CardContent>
    </Card>
  );
};

export default PropertyNotes;
