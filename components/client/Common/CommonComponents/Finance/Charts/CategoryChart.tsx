'use client';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CATEGORY_BREAKDOWN = [
  { name: 'Rental Income', value: 46, color: '#2E8B6F' },
  { name: 'Mortgage Payment', value: 28, color: '#D96B4E' },
  { name: 'Repairs', value: 14, color: '#E0A83E' },
  { name: 'Insurance', value: 12, color: '#5B7FBF' },
];

const RADIAN = Math.PI / 180;

type LabelProps = {
  cx?: number;
  cy?: number;
  midAngle?: number;
  outerRadius?: number;
  name?: string;
  value?: number | string;
  fill?: string;
};

// Draws the bent leader line + dot + "Name - value%" text outside the ring,
// matching the reference chart's label style.
const renderLabel = (props: LabelProps) => {
  const {
    cx = 0,
    cy = 0,
    midAngle = 0,
    outerRadius = 0,
    name = '',
    value = 0,
    fill = 'currentColor',
  } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);

  const sx = cx + (outerRadius + 8) * cos;
  const sy = cy + (outerRadius + 8) * sin;
  const mx = cx + (outerRadius + 26) * cos;
  const my = cy + (outerRadius + 26) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 16;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        strokeWidth={1.5}
        fill='none'
      />
      <circle cx={ex} cy={ey} r={2.5} fill={fill} stroke='none' />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 6}
        y={ey}
        textAnchor={textAnchor}
        dominantBaseline='central'
        className='fill-foreground/80 text-[12px]'
      >
        {`${name} - ${value}%`}
      </text>
    </g>
  );
};

const renderLegend = () => {
  return (
    <ul className='mb-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5'>
      {CATEGORY_BREAKDOWN.map((entry) => (
        <li key={entry.value} className='flex items-center gap-2 text-sm'>
          <span
            className='h-0.5 w-4 shrink-0'
            style={{ backgroundColor: entry.color }}
          />
          <span className='text-foreground/80'>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

const CategoryChart: React.FC = () => {
  return (
    <Card className='gap-0 overflow-hidden'>
      <CardHeader className='border-b pb-4'>
        <CardTitle className='text-base font-semibold'>By category</CardTitle>
      </CardHeader>

      <CardContent className='pt-4'>
        <div className='h-90 w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart margin={{ top: 8, right: 40, bottom: 8, left: 40 }}>
              <Legend verticalAlign='top' content={renderLegend} />
              <Pie
                data={CATEGORY_BREAKDOWN}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='55%'
                innerRadius={70}
                outerRadius={110}
                paddingAngle={2}
                stroke='none'
                label={renderLabel}
                labelLine={false}
                isAnimationActive={false}
              >
                {CATEGORY_BREAKDOWN.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryChart;
