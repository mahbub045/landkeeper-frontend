import Image from 'next/image';

// Monument markers scattered across the map — each represents a tracked
// parcel. Positions are hand-placed to feel surveyed, not randomised.
const MARKERS = [
  { top: '18%', left: '22%', pulse: false },
  { top: '34%', left: '68%', pulse: true },
  { top: '52%', left: '14%', pulse: false },
  { top: '61%', left: '78%', pulse: false },
  { top: '76%', left: '40%', pulse: false },
];

const FIELD_LOG = [
  { value: '12,400+', label: 'Parcels tracked' },
  { value: '98%', label: 'Uptime guaranteed' },
  { value: '340+', label: 'Organisations onboard' },
  { value: '24/7', label: 'Support on call' },
];

const AuthPageLeftPanel: React.FC = () => {
  return (
    <div className='bg-primary dark:bg-primary/80 relative hidden flex-col justify-between overflow-hidden p-12 lg:flex lg:w-1/2'>
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
          <p>SURVEY REF.</p>
          <p className='text-primary-foreground/70'>23.8103° N, 90.4125° E</p>
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
          Track parcels, monitor applications, and stay on top of every land
          management task — all in one place.
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
      </div>

      {/* Testimonial */}
      <div className='relative z-10'>
        <div className='border-secondary/60 relative border-l-2 pl-4'>
          <p className='text-primary-foreground/80 text-sm italic'>
            Landkeeper transformed how we handle our portfolio of 2,000+
            parcels.
          </p>
          <p className='text-primary-foreground/50 mt-2 text-xs tracking-wide uppercase'>
            — Director, National Land Authority
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPageLeftPanel;
