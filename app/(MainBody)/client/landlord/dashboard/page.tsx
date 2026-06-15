import LandlordCharts from './landlordCharts.tsx/landlordCharts';
import LandlordStats from './landlordStats.tsx/landlordStats';


export default function DashboardPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
          Dashboard
        </h1>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Welcome back. Here&apos;s your portfolio overview.
        </p>
      </div>

      <LandlordStats />
      <LandlordCharts />
    </div>
  );
}