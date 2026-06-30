import Image from 'next/image';

const AuthPageMobileLogo: React.FC = () => {
  return (
    <div className='mb-4 flex justify-center lg:hidden'>
      <Image
        src='/images/logo-black.png'
        alt='Landkeeper'
        width={400}
        height={150}
        className='h-12 w-40 rounded-xl dark:hidden'
        loading='eager'
      />
      <Image
        src='/images/logo-white.png'
        alt='Landkeeper'
        width={400}
        height={150}
        className='hidden h-12 w-40 rounded-xl dark:block'
        loading='eager'
      />
    </div>
  );
};

export default AuthPageMobileLogo;
