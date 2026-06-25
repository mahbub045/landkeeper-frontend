import { useTheme } from 'next-themes';
import Image from 'next/image';

const AuthPageMobileLogo: React.FC = () => {
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === 'dark' || resolvedTheme === 'dark';
  const logoSrc = isDark ? '/images/logo-white.png' : '/images/logo-black.png';

  return (
    <div className='mb-4 flex justify-center lg:hidden'>
      <Image
        src={logoSrc}
        alt='Landkeeper'
        width={400}
        height={150}
        className='h-12 w-40 rounded-xl'
        loading='eager'
      />
    </div>
  );
};

export default AuthPageMobileLogo;
