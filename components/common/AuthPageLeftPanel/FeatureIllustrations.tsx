import {
  BadgeCheck,
  Bell,
  Building2,
  ChartColumn,
  ChartPie,
  CircleCheck,
  Download,
  FileText,
  Flame,
  Hammer,
  House,
  Landmark,
  LayoutDashboard,
  PoundSterling,
  ShieldCheck,
  Star,
  Store,
  TrendingUp,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';

import type { FeatureAppIconProps } from '@/types/common/auth/AuthPageLeftPanelTypes';

// Each illustration is a small "stage" of floating mock-UI cards, styled
// after the product screens they represent. Purely decorative.

const CARD =
  'absolute rounded-2xl bg-white text-slate-800 shadow-2xl shadow-black/25';

// Coloured confetti shapes scattered around every stage.
const Confetti: React.FC = () => (
  <>
    <span className='absolute top-[8%] left-[6%] h-3 w-3 rounded-full bg-orange-400/90' />
    <span className='absolute top-[2%] right-[10%] h-4 w-2 rotate-45 rounded-full bg-amber-300' />
    <span className='bg-secondary absolute right-[2%] bottom-[30%] h-3 w-5 -rotate-12 rounded-full' />
    <span className='absolute bottom-[6%] left-[14%] h-2.5 w-2.5 rounded-full bg-fuchsia-400/90' />
    <span className='absolute top-[40%] left-[0%] h-4 w-2 -rotate-30 rounded-full bg-emerald-300/90' />
  </>
);

const AppIcon: React.FC<FeatureAppIconProps> = ({ icon: Icon, className }) => (
  <div
    className={`absolute flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-xl shadow-black/20 ${className}`}
  >
    <Icon className='text-primary h-6 w-6' />
  </div>
);

export const PropertiesIllustration: React.FC = () => (
  <div className='relative mx-auto h-75 w-full max-w-95'>
    <Confetti />
    <AppIcon icon={Building2} className='top-[6%] left-[30%]' />

    {/* Main property card */}
    <div className={`${CARD} top-[14%] right-[4%] w-[58%] overflow-hidden`}>
      <div className='from-primary/80 to-primary relative h-20 bg-linear-to-br'>
        <House className='absolute right-3 bottom-2 h-10 w-10 text-white/40' />
        <span className='absolute top-2 left-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-semibold text-white'>
          Occupied
        </span>
      </div>
      <div className='p-3'>
        <p className='text-[11px] font-semibold'>14 Kensington Gardens</p>
        <p className='text-[9px] text-slate-500'>London · 3 bed flat</p>
        <div className='mt-2 grid grid-cols-2 gap-1.5'>
          <div className='rounded-lg bg-slate-100 px-2 py-1.5'>
            <p className='text-[8px] text-slate-500'>Monthly rent</p>
            <p className='text-[11px] font-semibold'>£1,850</p>
          </div>
          <div className='rounded-lg bg-slate-100 px-2 py-1.5'>
            <p className='text-[8px] text-slate-500'>Lease ends</p>
            <p className='text-[11px] font-semibold'>Aug 2027</p>
          </div>
        </div>
      </div>
    </div>

    {/* Tenants card */}
    <div className={`${CARD} top-[40%] left-[4%] w-[44%] p-3`}>
      <div className='mb-2 flex items-center gap-1.5'>
        <Users className='text-primary h-3.5 w-3.5' />
        <p className='text-[11px] font-semibold'>Tenants</p>
      </div>
      {[
        ['JS', 'James Smith', 'bg-sky-500'],
        ['AP', 'Aisha Patel', 'bg-violet-500'],
      ].map(([initials, name, color]) => (
        <div key={name} className='flex items-center gap-2 py-1'>
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full text-[7px] font-bold text-white ${color}`}
          >
            {initials}
          </span>
          <span className='text-[10px]'>{name}</span>
        </div>
      ))}
    </div>

    {/* Toast */}
    <div
      className={`${CARD} bottom-[6%] left-[22%] flex items-center gap-2 rounded-full px-3 py-1.5`}
    >
      <CircleCheck className='h-3.5 w-3.5 text-emerald-500' />
      <span className='text-[10px] font-medium'>New tenancy signed</span>
    </div>
  </div>
);

export const RentIllustration: React.FC = () => (
  <div className='relative mx-auto h-75 w-full max-w-95'>
    <Confetti />
    <AppIcon icon={PoundSterling} className='top-[4%] right-[18%]' />

    {/* Rent collected chart */}
    <div className={`${CARD} top-[16%] left-[4%] w-[60%] p-3`}>
      <div className='flex items-center justify-between'>
        <p className='text-[11px] font-semibold'>Rent collected</p>
        <span className='flex items-center gap-0.5 text-[9px] font-semibold text-emerald-600'>
          <TrendingUp className='h-3 w-3' /> 12%
        </span>
      </div>
      <p className='mt-1 text-lg font-bold'>£24,600</p>
      <div className='mt-2 flex h-20 items-end gap-1.5'>
        {[45, 60, 52, 70, 64, 82, 95].map((h, i) => (
          <span
            key={i}
            style={{ height: `${h}%` }}
            className={`flex-1 rounded-t-md ${i === 6 ? 'bg-primary' : 'bg-primary/25'}`}
          />
        ))}
      </div>
    </div>

    {/* Expenses card */}
    <div className={`${CARD} top-[44%] right-[4%] w-[44%] p-3`}>
      <p className='text-[11px] font-semibold'>This month</p>
      {[
        ['Income', '£4,100', 'text-emerald-600'],
        ['Expenses', '£620', 'text-rose-500'],
        ['Mortgage', '£1,240', 'text-slate-700'],
      ].map(([label, value, color]) => (
        <div key={label} className='mt-1.5 flex justify-between text-[10px]'>
          <span className='text-slate-500'>{label}</span>
          <span className={`font-semibold ${color}`}>{value}</span>
        </div>
      ))}
    </div>

    <div
      className={`${CARD} bottom-[4%] left-[12%] flex items-center gap-2 rounded-full px-3 py-1.5`}
    >
      <CircleCheck className='h-3.5 w-3.5 text-emerald-500' />
      <span className='text-[10px] font-medium'>Rent received · £1,850</span>
    </div>
  </div>
);

export const ComplianceIllustration: React.FC = () => (
  <div className='relative mx-auto h-75 w-full max-w-95'>
    <Confetti />
    <AppIcon icon={ShieldCheck} className='top-[8%] left-[10%]' />

    {/* Certificates list */}
    <div className={`${CARD} top-[10%] right-[4%] w-[62%] p-3`}>
      <p className='mb-2 text-[11px] font-semibold'>Certificates</p>
      {[
        {
          icon: Flame,
          name: 'Gas Safety',
          status: 'Valid',
          tone: 'bg-emerald-100 text-emerald-700',
        },
        {
          icon: Zap,
          name: 'EICR',
          status: 'Due in 14d',
          tone: 'bg-amber-100 text-amber-700',
        },
        {
          icon: FileText,
          name: 'EPC',
          status: 'Valid',
          tone: 'bg-emerald-100 text-emerald-700',
        },
      ].map(({ icon: Icon, name, status, tone }) => (
        <div
          key={name}
          className='flex items-center justify-between border-t border-slate-100 py-1.5 first:border-t-0'
        >
          <span className='flex items-center gap-2 text-[10px]'>
            <span className='bg-primary/10 flex h-5 w-5 items-center justify-center rounded-md'>
              <Icon className='text-primary h-3 w-3' />
            </span>
            {name}
          </span>
          <span
            className={`rounded-full px-1.5 py-0.5 text-[8px] font-semibold ${tone}`}
          >
            {status}
          </span>
        </div>
      ))}
    </div>

    {/* Compliance score */}
    <div
      className={`${CARD} bottom-[14%] left-[4%] flex w-[40%] flex-col items-center p-3`}
    >
      <div className='relative h-16 w-16'>
        <svg viewBox='0 0 36 36' className='h-full w-full -rotate-90'>
          <circle
            cx='18'
            cy='18'
            r='15'
            fill='none'
            strokeWidth='4'
            className='stroke-slate-100'
          />
          <circle
            cx='18'
            cy='18'
            r='15'
            fill='none'
            strokeWidth='4'
            strokeLinecap='round'
            strokeDasharray='94.2'
            strokeDashoffset='8.5'
            className='stroke-primary'
          />
        </svg>
        <span className='absolute inset-0 flex items-center justify-center text-sm font-bold'>
          91%
        </span>
      </div>
      <p className='mt-1 text-[10px] text-slate-500'>Compliant</p>
    </div>

    <div
      className={`${CARD} right-[8%] bottom-[8%] flex items-center gap-2 rounded-full px-3 py-1.5`}
    >
      <Bell className='h-3.5 w-3.5 text-amber-500' />
      <span className='text-[10px] font-medium'>EICR renewal reminder</span>
    </div>
  </div>
);

export const MtdIllustration: React.FC = () => (
  <div className='relative mx-auto h-75 w-full max-w-95'>
    <Confetti />
    <AppIcon icon={Landmark} className='top-[4%] left-[44%]' />

    {/* Quarterly updates */}
    <div className={`${CARD} top-[20%] left-[4%] w-[56%] p-3`}>
      <p className='text-[11px] font-semibold'>Quarterly updates</p>
      <p className='text-[9px] text-slate-500'>Tax year 2026/27</p>
      <div className='mt-2 grid grid-cols-4 gap-1'>
        {['Q1', 'Q2', 'Q3', 'Q4'].map((q, i) => (
          <div
            key={q}
            className={`rounded-lg py-1.5 text-center text-[9px] font-semibold ${
              i < 2
                ? 'bg-emerald-100 text-emerald-700'
                : i === 2
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-400'
            }`}
          >
            {q}
          </div>
        ))}
      </div>
      <div className='mt-2 flex justify-between text-[10px]'>
        <span className='text-slate-500'>Next deadline</span>
        <span className='font-semibold'>5 Feb 2027</span>
      </div>
    </div>

    {/* Summary card */}
    <div className={`${CARD} top-[46%] right-[4%] w-[46%] p-3`}>
      <p className='text-[11px] font-semibold'>Q3 summary</p>
      {[
        ['Income', '£12,300'],
        ['Expenses', '£2,140'],
        ['Profit', '£10,160'],
      ].map(([label, value]) => (
        <div key={label} className='mt-1.5 flex justify-between text-[10px]'>
          <span className='text-slate-500'>{label}</span>
          <span className='font-semibold'>{value}</span>
        </div>
      ))}
    </div>

    <div
      className={`${CARD} bottom-[4%] left-[10%] flex items-center gap-2 rounded-full px-3 py-1.5`}
    >
      <CircleCheck className='h-3.5 w-3.5 text-emerald-500' />
      <span className='text-[10px] font-medium'>Submitted to HMRC</span>
    </div>
  </div>
);

export const DashboardIllustration: React.FC = () => (
  <div className='relative mx-auto h-75 w-full max-w-95'>
    <Confetti />
    <AppIcon icon={LayoutDashboard} className='top-[2%] left-[8%]' />

    {/* KPI tiles + trend */}
    <div className={`${CARD} top-[12%] right-[4%] w-[66%] p-3`}>
      <p className='mb-2 text-[11px] font-semibold'>Portfolio overview</p>
      <div className='grid grid-cols-3 gap-1.5'>
        {[
          ['Properties', '12', 'bg-sky-50 text-sky-700'],
          ['Occupancy', '94%', 'bg-emerald-50 text-emerald-700'],
          ['Arrears', '£320', 'bg-rose-50 text-rose-600'],
        ].map(([label, value, tone]) => (
          <div key={label} className={`rounded-lg px-2 py-1.5 ${tone}`}>
            <p className='text-[8px] opacity-80'>{label}</p>
            <p className='text-[13px] font-bold'>{value}</p>
          </div>
        ))}
      </div>
      <svg viewBox='0 0 200 50' className='mt-2 h-12 w-full' fill='none'>
        <path
          d='M0 42 L28 34 L56 38 L84 24 L112 28 L140 14 L168 18 L200 6 L200 50 L0 50 Z'
          className='fill-primary/10'
        />
        <path
          d='M0 42 L28 34 L56 38 L84 24 L112 28 L140 14 L168 18 L200 6'
          strokeWidth='2.5'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='stroke-primary'
        />
      </svg>
    </div>

    {/* Upcoming tasks */}
    <div className={`${CARD} bottom-[14%] left-[4%] w-[50%] p-3`}>
      <p className='mb-1.5 text-[11px] font-semibold'>Upcoming</p>
      {[
        ['Rent due · Flat 2', 'bg-sky-500'],
        ['Boiler service', 'bg-amber-500'],
        ['Lease renewal', 'bg-violet-500'],
      ].map(([label, dot]) => (
        <div key={label} className='flex items-center gap-2 py-1 text-[10px]'>
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
          {label}
        </div>
      ))}
    </div>

    <div
      className={`${CARD} right-[6%] bottom-[6%] flex items-center gap-2 rounded-full px-3 py-1.5`}
    >
      <Bell className='text-primary h-3.5 w-3.5' />
      <span className='text-[10px] font-medium'>3 tasks this week</span>
    </div>
  </div>
);

// Donut segments; each one's dash offset is the sum of the segments before it.
const EXPENSE_SEGMENTS = [
  { label: 'Repairs', pct: 40, stroke: 'stroke-primary', dot: 'bg-primary' },
  {
    label: 'Insurance',
    pct: 25,
    stroke: 'stroke-amber-400',
    dot: 'bg-amber-400',
  },
  {
    label: 'Agent fees',
    pct: 20,
    stroke: 'stroke-emerald-400',
    dot: 'bg-emerald-400',
  },
  { label: 'Other', pct: 15, stroke: 'stroke-rose-400', dot: 'bg-rose-400' },
];

export const ReportsIllustration: React.FC = () => (
  <div className='relative mx-auto h-75 w-full max-w-95'>
    <Confetti />
    <AppIcon icon={ChartColumn} className='top-[2%] right-[14%]' />

    {/* Expense breakdown donut */}
    <div className={`${CARD} top-[14%] left-[4%] w-[52%] p-3`}>
      <div className='mb-2 flex items-center gap-1.5'>
        <ChartPie className='text-primary h-3.5 w-3.5' />
        <p className='text-[11px] font-semibold'>Expense breakdown</p>
      </div>
      <div className='flex items-center gap-3'>
        <svg viewBox='0 0 36 36' className='h-16 w-16 shrink-0 -rotate-90'>
          {EXPENSE_SEGMENTS.map((seg, i) => {
            const offset = EXPENSE_SEGMENTS.slice(0, i).reduce(
              (sum, s) => sum + s.pct,
              0,
            );
            return (
              <circle
                key={seg.label}
                cx='18'
                cy='18'
                r='15.9'
                fill='none'
                strokeWidth='5'
                pathLength='100'
                strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
                strokeDashoffset={-offset}
                className={seg.stroke}
              />
            );
          })}
        </svg>
        <div className='space-y-1'>
          {EXPENSE_SEGMENTS.map((seg) => (
            <p key={seg.label} className='flex items-center gap-1.5 text-[9px]'>
              <span className={`h-1.5 w-1.5 rounded-full ${seg.dot}`} />
              {seg.label}
            </p>
          ))}
        </div>
      </div>
    </div>

    {/* Yield by property */}
    <div className={`${CARD} top-[48%] right-[4%] w-[48%] p-3`}>
      <p className='mb-2 text-[11px] font-semibold'>Yield by property</p>
      {[
        { name: 'Kensington', width: 82, value: '6.8%' },
        { name: 'Camden', width: 64, value: '5.4%' },
        { name: 'Hackney', width: 48, value: '4.1%' },
      ].map(({ name, width, value }) => (
        <div key={name} className='mb-1.5'>
          <div className='flex justify-between text-[9px]'>
            <span className='text-slate-500'>{name}</span>
            <span className='font-semibold'>{value}</span>
          </div>
          <div className='mt-0.5 h-1.5 rounded-full bg-slate-100'>
            <div
              style={{ width: `${width}%` }}
              className='bg-primary h-full rounded-full'
            />
          </div>
        </div>
      ))}
    </div>

    <div
      className={`${CARD} bottom-[4%] left-[12%] flex items-center gap-2 rounded-full px-3 py-1.5`}
    >
      <Download className='text-primary h-3.5 w-3.5' />
      <span className='text-[10px] font-medium'>Annual report ready</span>
    </div>
  </div>
);

export const MarketplaceIllustration: React.FC = () => (
  <div className='relative mx-auto h-75 w-full max-w-95'>
    <Confetti />
    <AppIcon icon={Store} className='top-[4%] left-[40%]' />

    {/* Categories */}
    <div className={`${CARD} top-[18%] left-[4%] w-[40%] p-3`}>
      <p className='mb-2 text-[11px] font-semibold'>Categories</p>
      <div className='grid grid-cols-2 gap-2'>
        {[
          { icon: Wrench, label: 'Plumbing', tone: 'bg-sky-100 text-sky-600' },
          {
            icon: Zap,
            label: 'Electrical',
            tone: 'bg-amber-100 text-amber-600',
          },
          {
            icon: Hammer,
            label: 'Repairs',
            tone: 'bg-violet-100 text-violet-600',
          },
          {
            icon: ShieldCheck,
            label: 'Insurance',
            tone: 'bg-emerald-100 text-emerald-600',
          },
        ].map(({ icon: Icon, label, tone }) => (
          <div key={label} className='flex flex-col items-center gap-1'>
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-lg ${tone}`}
            >
              <Icon className='h-3.5 w-3.5' />
            </span>
            <span className='text-[8px] text-slate-500'>{label}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Provider card */}
    <div className={`${CARD} top-[30%] right-[4%] w-[52%] p-3`}>
      <div className='flex items-center gap-2'>
        <span className='bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white'>
          BG
        </span>
        <div>
          <p className='flex items-center gap-1 text-[11px] font-semibold'>
            BrightGas Services
            <BadgeCheck className='text-primary h-3 w-3' />
          </p>
          <p className='flex items-center gap-0.5 text-[9px] text-slate-500'>
            <Star className='h-2.5 w-2.5 fill-amber-400 text-amber-400' />
            4.9 · Gas Safe registered
          </p>
        </div>
      </div>
      <div className='mt-2 flex flex-wrap gap-1'>
        {['Gas safety', 'Boilers', 'Heating'].map((service) => (
          <span
            key={service}
            className='rounded-full bg-slate-100 px-1.5 py-0.5 text-[8px] text-slate-600'
          >
            {service}
          </span>
        ))}
      </div>
      <div className='bg-primary mt-2 rounded-lg py-1.5 text-center text-[10px] font-semibold text-white'>
        Get in touch
      </div>
    </div>

    <div
      className={`${CARD} bottom-[6%] left-[14%] flex items-center gap-2 rounded-full px-3 py-1.5`}
    >
      <BadgeCheck className='h-3.5 w-3.5 text-emerald-500' />
      <span className='text-[10px] font-medium'>Verified local providers</span>
    </div>
  </div>
);
