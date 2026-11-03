import { PublicPageHeroProps } from '@/types/common/LegalPages/LegalPagesTypes';

const PublicPageHero: React.FC<PublicPageHeroProps> = ({
  icon: Icon,
  eyebrow,
  title,
  description,
  children,
}) => {
  return (
    <section className='from-primary/5 relative overflow-hidden border-b bg-linear-to-b to-transparent'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-[0.06]'>
        <div
          className='h-full w-full'
          style={{
            backgroundImage:
              'radial-gradient(circle at 25px 25px, currentColor 2px, transparent 0)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>
      {/* Decorative Blur */}
      <div className='bg-primary/15 absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl' />
      <div className='bg-primary/10 absolute -right-24 -bottom-32 h-80 w-80 rounded-full blur-3xl' />

      <div className='relative px-4 py-14 text-center md:px-6 md:py-20'>
        <div className='bg-background/80 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium shadow-sm backdrop-blur'>
          <Icon className='text-primary h-3.5 w-3.5' />
          {eyebrow}
        </div>
        <h1 className='mt-5 text-4xl font-bold tracking-tight md:text-5xl'>
          {title}
        </h1>
        <p className='text-muted-foreground mx-auto mt-4 max-w-2xl text-base md:text-lg'>
          {description}
        </p>
        {children && <div className='mt-8'>{children}</div>}
      </div>
    </section>
  );
};

export default PublicPageHero;
