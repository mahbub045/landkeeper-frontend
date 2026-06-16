import LandlordChartsContainer from "./LandlaordCharts/LandlordChartsContainer";
import LandlordStatsContainer from "./LandlordStats/LandlordStatsContainer";

export default function LandlordDashboardContainer() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Welcome back. Here&apos;s your portfolio overview.
        </p>
      </div>

      <LandlordStatsContainer />
      <LandlordChartsContainer />
    </div>
  );
}
