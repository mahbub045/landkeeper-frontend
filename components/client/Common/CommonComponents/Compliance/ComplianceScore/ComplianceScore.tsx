'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComplianceScoreProps } from '@/types/client/Landlord/Compliance/ComplianceTypes';

function DonutChart({ percent }: { percent: number }) {
  const r = 70;
  const cx = 100;
  const cy = 100;
  const circumference = 2 * Math.PI * r;
  const filled = (percent / 100) * circumference;

  return (
    <svg viewBox='0 0 200 200' className='h-44 w-44'>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill='none'
        stroke='currentColor'
        strokeWidth='14'
        className='text-muted'
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill='none'
        stroke='#10b981'
        strokeWidth='14'
        strokeLinecap='round'
        strokeDasharray={`${filled} ${circumference}`}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text
        x={cx}
        y={cy - 8}
        textAnchor='middle'
        dominantBaseline='middle'
        className='fill-foreground'
        style={{ fontSize: 28, fontWeight: 700 }}
      >
        {percent}%
      </text>
      <text
        x={cx}
        y={cy + 18}
        textAnchor='middle'
        dominantBaseline='middle'
        className='fill-muted-foreground'
        style={{ fontSize: 13 }}
      >
        Compliant
      </text>
    </svg>
  );
}

const ComplianceScore: React.FC<ComplianceScoreProps> = ({
  percent,
  validCount,
  totalCount,
  breakdown,
}) => {
  return (
    <Card className='border-border rounded-2xl shadow-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-foreground text-base font-semibold'>
          Compliance Score
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col items-center gap-4 pb-6'>
        <DonutChart percent={percent} />

        <p className='text-muted-foreground text-sm'>
          {validCount} of {totalCount} properties have valid certificates
        </p>

        <div className='mt-2 w-full space-y-4'>
          {breakdown.map((item) => (
            <div key={item.label}>
              <div className='mb-1.5 flex items-center justify-between'>
                <span className='text-muted-foreground text-sm'>
                  {item.label}
                </span>
                <span className='text-foreground text-sm font-semibold'>
                  {item.current}/{item.total}
                </span>
              </div>
              <div className='bg-muted h-2.5 w-full rounded-full'>
                <div
                  className={`h-2.5 rounded-full transition-all ${item.color}`}
                  style={{ width: `${(item.current / item.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceScore;
