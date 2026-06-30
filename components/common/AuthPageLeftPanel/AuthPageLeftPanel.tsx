import Image from 'next/image';

const AuthPageLeftPanel: React.FC = () => {
  return (
    <div className='bg-primary dark:bg-primary/60 relative hidden flex-col justify-between overflow-hidden p-12 lg:flex lg:w-1/2'>
      <div className='absolute inset-0 opacity-10'>
        <div
          className='absolute top-0 left-0 h-full w-full'
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 0)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className='relative flex items-center gap-3'>
        <Image
          src='/images/logo-white.png'
          alt='Landkeeper'
          width={400}
          height={100}
          className='h-12 w-40 rounded-xl'
          loading='eager'
        />
      </div>

      <div className='relative'>
        <h1 className='mb-4 text-4xl leading-tight font-bold text-white'>
          Manage your land,
          <br />
          <span className='text-secondary'>effortlessly.</span>
        </h1>
        <p className='text-secondary max-w-sm text-lg leading-relaxed'>
          Track parcels, monitor applications, and stay on top of every land
          management task — all in one place.
        </p>

        <div className='mt-10 grid grid-cols-2 gap-6'>
          {[
            { value: '12,400+', label: 'Land parcels tracked' },
            { value: '98%', label: 'Uptime guarantee' },
            { value: '340+', label: 'Organisations' },
            { value: '24/7', label: 'Support available' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className='text-2xl font-bold text-white'>{stat.value}</p>
              <p className='text-secondary mt-1 text-sm'>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='border-secondary relative border-l-2 pl-4'>
        <p className='text-secondary text-sm italic'>
          Landkeeper transformed how we handle our portfolio of 2,000+ parcels.
        </p>
        <p className='mt-2 text-xs text-white'>
          — Director, National Land Authority
        </p>
      </div>
    </div>
  );
};

export default AuthPageLeftPanel;
