export default function AppFooter() {
  return (
    <footer className='mt-auto border-t bg-background px-4 py-4 md:px-6'>
      <div className='flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row'>
        <p>© {new Date().getFullYear()} Landkeeper. All rights reserved.</p>
        <div className='flex items-center gap-4'>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Support</span>
        </div>
      </div>
    </footer>
  );
}
