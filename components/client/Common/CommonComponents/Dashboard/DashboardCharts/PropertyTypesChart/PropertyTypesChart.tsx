'use client';

import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FALLBACK_COLOR,
  PROPERTY_TYPE_COLORS,
} from '@/data/client/Common/Dashboard/DashboardData';
import { useGetDashboardPropertyTypesQuery } from '@/store/api/endpoints/client/Common/Dashboard/DashboardApi';
import {
  PropertyPieCallout,
  PropertyPieSlice,
  PropertyTypeItem,
} from '@/types/client/Common/Dashboard/DashboardTypes';
import { Building2, PieChartIcon } from 'lucide-react';
import { useId } from 'react';
import PropertyTypesChartSkeleton from './PropertyTypesChartSkeleton';

// Stepped donut geometry (SVG units)
const VIEW_WIDTH = 560;
const VIEW_HEIGHT = 300;
const CX = VIEW_WIDTH / 2;
const CY = 148;
const INNER_RADIUS = 52;
const CENTER_RADIUS = 46;
const MIN_OUTER_RADIUS = 96;
const MAX_OUTER_RADIUS = 122;
const DEPTH = 6;
const MIN_LABEL_PERCENT = 5;
const PILL_WIDTH = 124;
const PILL_HEIGHT = 24;
const PILL_MARGIN = 8;
const CALLOUT_SPACING = 52;
const CALLOUT_TOP = 24;
const CALLOUT_BOTTOM = VIEW_HEIGHT - 34;
const FULL_CIRCLE = Math.PI * 2;

const point = (radius: number, angle: number) => ({
  x: CX + radius * Math.cos(angle),
  y: CY + radius * Math.sin(angle),
});

const buildSlices = (items: PropertyTypeItem[]): PropertyPieSlice[] => {
  const total = items.reduce((sum, item) => sum + item.percentage, 0) || 1;
  // Larger shares get a taller slice, giving the stepped look
  const ranks = [...items]
    .sort((a, b) => b.percentage - a.percentage)
    .map((item) => item.type);
  const step =
    items.length > 1
      ? (MAX_OUTER_RADIUS - MIN_OUTER_RADIUS) / (items.length - 1)
      : 0;
  let angle = -Math.PI / 2;
  return items.map((item) => {
    const startAngle = angle;
    angle += (item.percentage / total) * FULL_CIRCLE;
    return {
      ...item,
      color: PROPERTY_TYPE_COLORS[item.type] ?? FALLBACK_COLOR,
      startAngle,
      endAngle: angle,
      outerRadius: MAX_OUTER_RADIUS - ranks.indexOf(item.type) * step,
    };
  });
};

const slicePath = ({ startAngle, endAngle, outerRadius }: PropertyPieSlice) => {
  // A full 360° arc collapses to nothing, so stop just short of it
  const end = Math.min(endAngle, startAngle + FULL_CIRCLE - 0.0001);
  const largeArc = end - startAngle > Math.PI ? 1 : 0;
  const o1 = point(outerRadius, startAngle);
  const o2 = point(outerRadius, end);
  const i1 = point(INNER_RADIUS, end);
  const i2 = point(INNER_RADIUS, startAngle);
  return [
    `M ${o1.x} ${o1.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${o2.x} ${o2.y}`,
    `L ${i1.x} ${i1.y}`,
    `A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArc} 0 ${i2.x} ${i2.y}`,
    'Z',
  ].join(' ');
};

const midAngle = ({ startAngle, endAngle }: PropertyPieSlice) =>
  (startAngle + endAngle) / 2;

const formatPercent = (value: number) =>
  `${Number(value.toFixed(1)).toString()}%`;

const shadeColor = (hex: string, percent: number) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const shift = (channel: number) =>
    Math.min(255, Math.max(0, channel + Math.round(2.55 * percent)));
  return `rgb(${shift((num >> 16) & 0xff)}, ${shift((num >> 8) & 0xff)}, ${shift(num & 0xff)})`;
};

// Spread callouts vertically on each side so pills never overlap
const buildCallouts = (slices: PropertyPieSlice[]): PropertyPieCallout[] => {
  const callouts = slices.map((slice): PropertyPieCallout => {
    const mid = midAngle(slice);
    const anchor = point(slice.outerRadius, mid);
    return {
      slice,
      side: Math.cos(mid) < 0 ? 'left' : 'right',
      anchorX: anchor.x,
      anchorY: anchor.y,
      labelY: anchor.y,
    };
  });

  (['left', 'right'] as const).forEach((side) => {
    const group = callouts
      .filter((callout) => callout.side === side)
      .sort((a, b) => a.anchorY - b.anchorY);
    if (group.length === 0) return;
    const spacing = Math.min(
      CALLOUT_SPACING,
      (CALLOUT_BOTTOM - CALLOUT_TOP) / Math.max(group.length - 1, 1),
    );
    group.forEach((callout, index) => {
      const prev = group[index - 1];
      callout.labelY = Math.max(
        callout.anchorY,
        CALLOUT_TOP,
        prev ? prev.labelY + spacing : CALLOUT_TOP,
      );
    });
    // Push back up if the stack ran past the bottom edge
    for (let index = group.length - 1; index >= 0; index -= 1) {
      const next = group[index + 1];
      group[index].labelY = Math.min(
        group[index].labelY,
        next ? next.labelY - spacing : CALLOUT_BOTTOM,
      );
    }
  });

  return callouts;
};

const PropertyTypesChart: React.FC = () => {
  const gradientPrefix = useId().replace(/:/g, '');
  const {
    data: propertyTypesData,
    isLoading,
    isError,
  } = useGetDashboardPropertyTypesQuery();

  if (isLoading) {
    return <PropertyTypesChartSkeleton />;
  }

  if (isError || !propertyTypesData) {
    return <CustomErrorMessage title='property types' />;
  }

  const { data, total } = propertyTypesData;
  const slices = buildSlices(data);
  const callouts = buildCallouts(slices);
  const centerGradientId = `${gradientPrefix}-center`;
  const shadowId = `${gradientPrefix}-shadow`;

  return (
    <Card className='rounded-2xl border border-gray-100 shadow-sm dark:border-gray-700/50'>
      <CardHeader className='pb-2'>
        <div className='flex items-center gap-2'>
          <PieChartIcon className='size-4 text-indigo-500' />
          <CardTitle className='text-base font-semibold text-gray-800 dark:text-gray-100'>
            Property Types
          </CardTitle>
        </div>
      </CardHeader>
      {data.length === 0 ? (
        <CardContent className='flex h-full flex-col items-center justify-center gap-2 py-2 text-center'>
          <PieChartIcon className='size-8 text-gray-300 dark:text-gray-600' />
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            No data found
          </p>
        </CardContent>
      ) : (
        <CardContent className='flex flex-col items-center pb-6'>
          <svg
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            className='w-full max-w-160'
            role='img'
            aria-label='Property types 3D pie chart'
          >
            <defs>
              <filter
                id={shadowId}
                x='-30%'
                y='-30%'
                width='160%'
                height='160%'
              >
                <feDropShadow
                  dx='0'
                  dy='4'
                  stdDeviation='4'
                  floodColor='#000'
                  floodOpacity='0.25'
                />
              </filter>
              <radialGradient id={centerGradientId} cx='40%' cy='35%' r='75%'>
                <stop offset='0%' stopColor='#ffffff' />
                <stop offset='70%' stopColor='#e5e7eb' />
                <stop offset='100%' stopColor='#c7cbd1' />
              </radialGradient>
              {slices.map((slice) => (
                <linearGradient
                  key={slice.type}
                  id={`${gradientPrefix}-${slice.type}`}
                  x1='0'
                  y1='0'
                  x2='1'
                  y2='1'
                >
                  <stop offset='0%' stopColor={shadeColor(slice.color, 18)} />
                  <stop offset='55%' stopColor={slice.color} />
                  <stop offset='100%' stopColor={shadeColor(slice.color, -18)} />
                </linearGradient>
              ))}
            </defs>

            {/* Callout leader lines and pills */}
            {callouts.map(({ slice, side, anchorX, anchorY, labelY }) => {
              const isLeft = side === 'left';
              const pillX = isLeft
                ? PILL_MARGIN
                : VIEW_WIDTH - PILL_MARGIN - PILL_WIDTH;
              const lineEndX = isLeft ? pillX + PILL_WIDTH : pillX;
              const elbowX = CX + (isLeft ? -1 : 1) * (MAX_OUTER_RADIUS + 16);
              return (
                <g key={`callout-${slice.type}`}>
                  <polyline
                    points={`${anchorX},${anchorY} ${elbowX},${labelY} ${lineEndX},${labelY}`}
                    fill='none'
                    stroke={slice.color}
                    strokeWidth={1.25}
                  />
                  <circle cx={anchorX} cy={anchorY} r={2.5} fill={slice.color} />
                  <rect
                    x={pillX}
                    y={labelY - PILL_HEIGHT / 2}
                    width={PILL_WIDTH}
                    height={PILL_HEIGHT}
                    rx={PILL_HEIGHT / 2}
                    fill={`url(#${gradientPrefix}-${slice.type})`}
                    filter={`url(#${shadowId})`}
                  />
                  <text
                    x={pillX + PILL_WIDTH / 2}
                    y={labelY}
                    textAnchor='middle'
                    dominantBaseline='central'
                    className='fill-white text-[11px] font-semibold'
                  >
                    {slice.label}
                  </text>
                  <text
                    x={pillX + (isLeft ? 4 : PILL_WIDTH - 4)}
                    y={labelY + PILL_HEIGHT / 2 + 11}
                    textAnchor={isLeft ? 'start' : 'end'}
                    className='fill-gray-500 text-[10px] dark:fill-gray-400'
                  >
                    {`${slice.count} ${slice.count === 1 ? 'property' : 'properties'}`}
                  </text>
                </g>
              );
            })}

            {/* Extruded base for depth */}
            <g filter={`url(#${shadowId})`}>
              {slices.map((slice) => (
                <path
                  key={`depth-${slice.type}`}
                  d={slicePath(slice)}
                  transform={`translate(0 ${DEPTH})`}
                  fill={shadeColor(slice.color, -30)}
                />
              ))}
            </g>

            {/* Top faces */}
            {slices.map((slice) => {
              const mid = midAngle(slice);
              const labelRadius = (INNER_RADIUS + slice.outerRadius) / 2 + 4;
              const labelPoint = point(labelRadius, mid);
              const hoverX = 4 * Math.cos(mid);
              const hoverY = 4 * Math.sin(mid);
              return (
                <g
                  key={slice.type}
                  className='cursor-pointer transition-transform duration-200 hover:transform-[translate(var(--hx),var(--hy))]'
                  style={
                    {
                      '--hx': `${hoverX}px`,
                      '--hy': `${hoverY}px`,
                    } as React.CSSProperties
                  }
                >
                  <title>{`${slice.label}: ${slice.count} (${formatPercent(slice.percentage)})`}</title>
                  <path
                    d={slicePath(slice)}
                    fill={`url(#${gradientPrefix}-${slice.type})`}
                    stroke={shadeColor(slice.color, 25)}
                    strokeWidth={1}
                    strokeLinejoin='round'
                  />
                  {slice.percentage >= MIN_LABEL_PERCENT && (
                    <text
                      x={labelPoint.x}
                      y={labelPoint.y}
                      textAnchor='middle'
                      dominantBaseline='central'
                      className='pointer-events-none fill-white text-[13px] font-bold'
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
                    >
                      {formatPercent(slice.percentage)}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Centre disc */}
            <circle
              cx={CX}
              cy={CY}
              r={CENTER_RADIUS}
              fill={`url(#${centerGradientId})`}
              filter={`url(#${shadowId})`}
            />
            <Building2
              x={CX - 11}
              y={CY - 30}
              width={22}
              height={22}
              className='text-gray-500'
            />
            <text
              x={CX}
              y={CY + 6}
              textAnchor='middle'
              dominantBaseline='central'
              className='fill-gray-700 text-[16px] font-bold'
            >
              {total}
            </text>
            <text
              x={CX}
              y={CY + 22}
              textAnchor='middle'
              dominantBaseline='central'
              className='fill-gray-500 text-[8px] font-semibold tracking-wider uppercase'
            >
              Properties
            </text>
          </svg>
        </CardContent>
      )}
    </Card>
  );
};

export default PropertyTypesChart;
