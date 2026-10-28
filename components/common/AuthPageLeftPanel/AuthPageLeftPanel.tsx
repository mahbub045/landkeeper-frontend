import Image from 'next/image';

// Monument markers scattered across the map — each represents a managed
// property. Positions are hand-placed to feel surveyed, not randomised.
const MARKERS = [
  { top: '18%', left: '22%', pulse: false },
  { top: '34%', left: '68%', pulse: true },
  { top: '52%', left: '14%', pulse: false },
  { top: '61%', left: '78%', pulse: false },
  { top: '76%', left: '40%', pulse: false },
];

const FIELD_LOG = [
  { value: 'Managed', label: 'Properties & tenants' },
  { value: 'Tracked', label: 'Rent, expenses & mortgages' },
  { value: 'On time', label: 'Compliance & certificates' },
  { value: 'Ready', label: 'Making Tax Digital' },
];

// Line-art skyline along the bottom edge. Ground sits at y=320 in the
// illustration's viewBox; window grids are derived from cols/rows.
const SKYLINE_GROUND = 320;
const BUILDINGS = [
  { x: 16, top: 170, w: 88, cols: 3, rows: 4 },
  { x: 104, top: 80, w: 92, cols: 3, rows: 7 },
  { x: 300, top: 30, w: 104, cols: 4, rows: 10 },
  { x: 404, top: 140, w: 72, cols: 2, rows: 5 },
  { x: 476, top: 100, w: 96, cols: 3, rows: 7 },
];

const AuthPageLeftPanel: React.FC = () => {
  return (
    <div className='relative hidden bg-[linear-gradient(160deg,oklch(0.27_0.09_262),oklch(0.38_0.15_261)_55%,oklch(0.5_0.19_260))] flex-col gap-12 overflow-hidden p-12 lg:flex lg:w-1/2'>
      {/* Topographic contour field */}
      <svg
        className='absolute inset-0 h-full w-full opacity-[0.12]'
        viewBox='0 0 600 800'
        preserveAspectRatio='xMidYMid slice'
        fill='none'
        aria-hidden='true'
      >
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <path
            key={i}
            d={`M -50 ${90 + i * 110} Q 150 ${20 + i * 110} 300 ${100 + i * 110} T 650 ${80 + i * 110}`}
            stroke='white'
            strokeWidth='1.25'
          />
        ))}
      </svg>

      {/* Parcel boundary grid */}
      <svg
        className='absolute inset-0 h-full w-full opacity-[0.06]'
        aria-hidden='true'
      >
        <defs>
          <pattern
            id='parcelGrid'
            width='64'
            height='64'
            patternUnits='userSpaceOnUse'
          >
            <path
              d='M 64 0 L 0 0 0 64'
              fill='none'
              stroke='white'
              strokeWidth='1'
            />
          </pattern>
        </defs>
        <rect width='100%' height='100%' fill='url(#parcelGrid)' />
      </svg>

      {/* Monument markers */}
      {MARKERS.map((m, i) => (
        <span
          key={i}
          className='absolute'
          style={{ top: m.top, left: m.left }}
          aria-hidden='true'
        >
          <span className='relative flex h-2 w-2'>
            {m.pulse && (
              <span className='bg-secondary absolute inline-flex h-full w-full animate-ping rounded-full opacity-60' />
            )}
            <span className='bg-secondary/80 relative inline-flex h-2 w-2 rounded-full' />
          </span>
        </span>
      ))}

      {/* Top row — logo + coordinate readout */}
      <div className='relative z-10 flex items-start justify-between'>
        <Image
          src='/images/logo-white.png'
          alt='Landkeeper'
          width={400}
          height={100}
          className='h-12 w-40 rounded-xl'
          loading='eager'
        />
        <div className='text-primary-foreground/50 hidden text-right text-[11px] leading-tight tracking-wide sm:block'>
          <p>PORTFOLIO REF.</p>
          <p className='text-primary-foreground/70'>51.5072° N, 0.1276° W</p>
        </div>
      </div>

      {/* Body */}
      <div className='relative z-10'>
        <h1 className='text-primary-foreground mb-4 text-4xl leading-[1.1] font-semibold tracking-tight'>
          Manage your property,
          <br />
          <span className='text-secondary'>effortlessly.</span>
        </h1>

        <p className='text-primary-foreground/70 max-w-sm text-[15px] leading-relaxed'>
          Manage properties, tenants, rent, compliance and maintenance — all
          in one place for landlords, letting agents and mortgage advisers.
        </p>

        {/* Field log — ledger-style stats */}
        <dl className='border-primary-foreground/15 mt-10 divide-y divide-dashed'>
          {FIELD_LOG.map((stat) => (
            <div
              key={stat.label}
              className='flex items-baseline justify-between border-t border-dashed border-inherit py-2.5 first:border-t-0'
            >
              <dt className='text-primary-foreground/60 text-[13px]'>
                {stat.label}
              </dt>
              <dd className='text-primary-foreground text-sm font-medium'>
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        {/* Testimonial */}
        <div className='border-secondary/60 relative mt-10 border-l-2 pl-4'>
          <p className='text-primary-foreground/80 text-sm italic'>
            Landkeeper keeps every tenancy, certificate and payment across our
            portfolio organised and on schedule.
          </p>
          <p className='text-primary-foreground/50 mt-2 text-xs tracking-wide uppercase'>
            — Portfolio Landlord
          </p>
        </div>
      </div>

      {/* Skyline illustration */}
      <svg
        className='pointer-events-none absolute inset-x-0 bottom-0 h-[38%] w-full'
        viewBox='0 0 600 322'
        preserveAspectRatio='xMidYMax meet'
        fill='none'
        aria-hidden='true'
      >
        <g stroke='white' strokeOpacity={0.35} strokeWidth='1.5'>
          {BUILDINGS.map((b, i) => {
            const pad = 12;
            const gap = 8;
            const winW = (b.w - pad * 2 - gap * (b.cols - 1)) / b.cols;
            return (
              <g key={i}>
                <rect
                  x={b.x}
                  y={b.top}
                  width={b.w}
                  height={SKYLINE_GROUND - b.top}
                />
                {Array.from({ length: b.rows * b.cols }).map((_, j) => {
                  const r = Math.floor(j / b.cols);
                  const c = j % b.cols;
                  return (
                    <rect
                      key={j}
                      x={b.x + pad + c * (winW + gap)}
                      y={b.top + 20 + r * 24}
                      width={winW}
                      height={12}
                      className={
                        (r + c + i) % 5 === 0 ? 'fill-secondary/40' : undefined
                      }
                    />
                  );
                })}
                <rect
                  x={b.x + b.w / 2 - 7}
                  y={SKYLINE_GROUND - 22}
                  width={14}
                  height={22}
                />
              </g>
            );
          })}

          {/* Rooftop + antenna on the tallest tower */}
          <rect x={330} y={12} width={44} height={18} />
          <path d='M 352 12 L 352 0' />

          {/* House */}
          <path d='M 206 232 L 245 196 L 284 232' />
          <rect x={212} y={228} width={66} height={SKYLINE_GROUND - 228} />
          <rect x={220} y={244} width={16} height={16} className='fill-secondary/40' />
          <rect x={254} y={244} width={16} height={16} />
          <rect x={238} y={SKYLINE_GROUND - 30} width={14} height={30} />

          {/* Trees */}
          <circle cx={290} cy={306} r={9} />
          <path d='M 586 320 L 586 292' />
          <circle cx={586} cy={280} r={13} />

          {/* Ground line */}
          <path d={`M 0 ${SKYLINE_GROUND} L 600 ${SKYLINE_GROUND}`} />
        </g>
      </svg>
    </div>
  );
};

export default AuthPageLeftPanel;
