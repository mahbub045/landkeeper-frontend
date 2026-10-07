'use client';

import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  COMPLIANCE_TYPE_COLORS,
  FALLBACK_COLOR,
} from '@/data/client/Common/Dashboard/DashboardData';
import { useGetDashboardComplianceTypesQuery } from '@/store/api/endpoints/client/Common/Dashboard/DashboardApi';
import {
  ComplianceTypeItem,
  Pie3DSlice,
} from '@/types/client/Common/Dashboard/DashboardTypes';
import { Activity, PieChartIcon } from 'lucide-react';
import ComplianceTypesCardSkeleton from './ComplianceTypesCardSkeleton';

// 3D pie geometry (SVG units)
const VIEW_WIDTH = 320;
const VIEW_HEIGHT = 230;
const CX = 160;
const CY = 100;
const RX = 150;
const RY = 88;
const DEPTH = 28;
const MIN_LABEL_PERCENT = 4;

const pointAt = (angle: number, dy = 0) =>
  `${CX + RX * Math.cos(angle)} ${CY + dy + RY * Math.sin(angle)}`;

const buildSlices = (items: ComplianceTypeItem[]): Pie3DSlice[] => {
  const total = items.reduce((sum, item) => sum + item.percentage, 0) || 1;
  let angle = -Math.PI / 2;
  return items.map((item) => {
    const startAngle = angle;
    angle += (item.percentage / total) * Math.PI * 2;
    return {
      ...item,
      color: COMPLIANCE_TYPE_COLORS[item.type] ?? FALLBACK_COLOR,
      startAngle,
      endAngle: angle,
    };
  });
};

const topPath = ({ startAngle, endAngle }: Pie3DSlice) => {
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${CX} ${CY} L ${pointAt(startAngle)} A ${RX} ${RY} 0 ${largeArc} 1 ${pointAt(endAngle)} Z`;
};

// Side wall is only visible on the front half of the ellipse (angles 0..PI)
const sidePath = ({ startAngle, endAngle }: Pie3DSlice) => {
  const start = Math.max(startAngle, 0);
  const end = Math.min(endAngle, Math.PI);
  if (end <= start) return null;
  return `M ${pointAt(start)} A ${RX} ${RY} 0 0 1 ${pointAt(end)} L ${pointAt(end, DEPTH)} A ${RX} ${RY} 0 0 0 ${pointAt(start, DEPTH)} Z`;
};

const formatPercent = (value: number) =>
  `${Number(value.toFixed(1)).toString()}%`;

const shadeColor = (hex: string, percent: number) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(
    255,
    Math.max(0, ((num >> 16) & 0xff) + Math.round(2.55 * percent)),
  );
  const g = Math.min(
    255,
    Math.max(0, ((num >> 8) & 0xff) + Math.round(2.55 * percent)),
  );
  const b = Math.min(
    255,
    Math.max(0, (num & 0xff) + Math.round(2.55 * percent)),
  );
  return `rgb(${r}, ${g}, ${b})`;
};

const ComplianceTypesCard: React.FC = () => {
  const {
    data: complianceTypesData,
    isLoading,
    isError,
  } = useGetDashboardComplianceTypesQuery();

  if (isLoading) {
    return <ComplianceTypesCardSkeleton />;
  }

  if (isError || !complianceTypesData) {
    return <CustomErrorMessage title='compliance types' />;
  }

  const { data } = complianceTypesData;
  const slices = buildSlices(data);

  return (
    <Card className='rounded-2xl border border-gray-100 shadow-sm dark:border-gray-700/50'>
      <CardHeader className='pb-3'>
        <div className='flex items-center gap-2'>
          <Activity className='size-4 text-teal-500' />
          <CardTitle className='text-base font-semibold text-gray-800 dark:text-gray-100'>
            Compliance Types
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
        <CardContent className='flex flex-col items-center gap-6 pb-6 md:flex-row md:justify-center'>
          <svg
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            className='w-full max-w-85 shrink-0'
            role='img'
            aria-label='Compliance types 3D pie chart'
          >
            {/* Side walls (depth) */}
            {slices.map((slice) => {
              const d = sidePath(slice);
              return d ? (
                <path
                  key={`side-${slice.type}`}
                  d={d}
                  fill={shadeColor(slice.color, -25)}
                  stroke={shadeColor(slice.color, -25)}
                  strokeWidth={0.5}
                />
              ) : null;
            })}
            {/* Top faces */}
            {slices.map((slice) =>
              slices.length === 1 ? (
                <ellipse
                  key={`top-${slice.type}`}
                  cx={CX}
                  cy={CY}
                  rx={RX}
                  ry={RY}
                  fill={slice.color}
                >
                  <title>{`${slice.label}: ${slice.count}`}</title>
                </ellipse>
              ) : (
                <path
                  key={`top-${slice.type}`}
                  d={topPath(slice)}
                  fill={slice.color}
                  stroke='#fff'
                  strokeWidth={1}
                  strokeLinejoin='round'
                >
                  <title>{`${slice.label}: ${slice.count}`}</title>
                </path>
              ),
            )}
            {/* Percentage labels */}
            {slices.map((slice) => {
              if (slice.percentage < MIN_LABEL_PERCENT) return null;
              const mid =
                slices.length === 1
                  ? Math.PI / 2
                  : (slice.startAngle + slice.endAngle) / 2;
              const radius = slices.length === 1 ? 0 : 0.62;
              return (
                <text
                  key={`label-${slice.type}`}
                  x={CX + RX * radius * Math.cos(mid)}
                  y={CY + RY * radius * Math.sin(mid)}
                  textAnchor='middle'
                  dominantBaseline='central'
                  className='pointer-events-none fill-white text-[12px] font-semibold'
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.35)' }}
                >
                  {formatPercent(slice.percentage)}
                </text>
              );
            })}
          </svg>
          {/* Legend */}
          <div className='flex flex-col gap-2'>
            {slices.map((slice) => (
              <div key={slice.type} className='flex items-center gap-2'>
                <span
                  className='inline-block size-3 shrink-0 rounded-full'
                  style={{ backgroundColor: slice.color }}
                />
                <span className='text-xs text-gray-600 dark:text-gray-400'>
                  {slice.label} ({slice.count})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ComplianceTypesCard;
