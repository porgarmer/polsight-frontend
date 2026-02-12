import KpiCard from "@/components/voter-forecast/kpi-card";
import ForecastChart from "@/components/voter-forecast/forecast-chart";
import InsightsCard from "@/components/insights-card";

export default function VoterForecastPage() {
  return (
    
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Vote Trends</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <KpiCard
          title="Total Voters Expected To Vote In 2028"
          value="10,386"
          delta="+2%"
          subLabel="Versus"
          subValue="10,245"
          subYear="2025"
        />
        <KpiCard
          title="Expected Turnout Rate In 2028"
          value="93.4%"
          delta="+2%"
          subLabel="Versus"
          subValue="70.0%"
          subYear="2025"
        />
      </div>

      <ForecastChart />
      <InsightsCard
        insights={[
          "Voter turnout is projected to increase by 2% in 2028.",
          "Historical data shows strong performance during high-registration years.",
          "Turnout dips appear correlated with off-cycle election fatigue.",
          "Registered voter growth remains stable across the last three cycles.",
        ]}
      />
    </div>
  );
}
