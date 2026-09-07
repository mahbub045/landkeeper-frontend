import PricingPlansCard from './PricingPlansCard/PricingPlansCard';

const PricingPlansContainer = (): React.ReactNode => {
  return (
    <div className='border-border/70 relative overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.09),transparent_30%)] p-5 sm:p-8'>
      <div className='mx-auto mb-8 max-w-2xl text-center'>
        <p className='text-primary text-xs font-semibold tracking-[0.2em] uppercase'>
          Landlord plans
        </p>
        <h4 className='mt-3 text-3xl font-semibold tracking-tight sm:text-4xl'>
          Choose the room to grow
        </h4>
        <p className='text-muted-foreground mx-auto mt-3 max-w-xl text-sm leading-6 sm:text-base'>
          Start with the essentials, then unlock more capacity and deeper
          portfolio tools as your property business expands.
        </p>
      </div>
      <PricingPlansCard />
    </div>
  );
};

export default PricingPlansContainer;
