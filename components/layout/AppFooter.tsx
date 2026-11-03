import { FOOTER_LINKS } from '@/data/common/LegalPages/LegalPagesData';
import Link from 'next/link';

const AppFooter: React.FC = () => {
  return (
    <footer className='bg-background mt-auto border-t px-4 py-4 md:px-6'>
      <div className='text-muted-foreground flex flex-col items-center justify-between gap-2 text-xs sm:flex-row'>
        <p>© {new Date().getFullYear()} Landkeeper. All rights reserved.</p>
        <div className='flex items-center gap-4'>
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='hover:text-foreground transition-colors'
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
