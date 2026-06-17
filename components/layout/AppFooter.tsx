const AppFooter: React.FC = () => {
  return (
    <footer className='bg-background mt-auto border-t px-4 py-4 md:px-6'>
      <div className='text-muted-foreground flex flex-col items-center justify-between gap-2 text-xs sm:flex-row'>
        <p>© {new Date().getFullYear()} Landkeeper. All rights reserved.</p>
        <div className='flex items-center gap-4'>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Support</span>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
