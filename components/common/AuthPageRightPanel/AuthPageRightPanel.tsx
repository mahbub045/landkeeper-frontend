import { cn } from '@/lib/utils';
import type { AuthPageRightPanelProps } from '@/types/common/auth/AuthPageRightPanelTypes';

// Form side of the auth pages: a softly tinted backdrop with brand-colour
// glows and a dot grid, and the form itself raised on a frosted card.
const AuthPageRightPanel: React.FC<AuthPageRightPanelProps> = ({
  children,
  cardClassName = 'max-w-md',
}) => {
  return (
    <div className='relative flex w-full overflow-y-auto bg-slate-50 p-4 sm:p-8 lg:w-1/2 dark:bg-gray-950'>
      {/* Brand glows */}
      <div
        className='pointer-events-none absolute inset-0 overflow-hidden'
        aria-hidden='true'
      >
        <span className='bg-primary/15 dark:bg-primary/20 absolute -top-32 -right-24 h-96 w-96 rounded-full blur-3xl' />
        <span className='absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-violet-300/20 blur-3xl dark:bg-violet-500/10' />
        <span className='bg-secondary/10 absolute top-1/2 left-1/3 h-64 w-64 rounded-full blur-3xl' />
      </div>

      {/* Dot grid, faded towards the edges */}
      <div
        className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgb(15_23_42/0.08)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)] bg-size-[22px_22px] dark:bg-[radial-gradient(circle,rgb(255_255_255/0.06)_1px,transparent_1px)]'
        aria-hidden='true'
      />

      {/* m-auto centres the card but lets long forms scroll from the top */}
      <div
        className={cn(
          'relative z-10 m-auto w-full rounded-3xl border border-white/80 bg-white/85 p-6 shadow-[0_24px_64px_-24px_rgb(30_64_175/0.28)] ring-1 ring-slate-900/5 backdrop-blur-xl sm:p-10 dark:border-white/10 dark:bg-gray-900/75 dark:ring-white/5',
          cardClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default AuthPageRightPanel;
