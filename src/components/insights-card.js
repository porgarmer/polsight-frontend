import { Card, CardContent } from "@/components/ui/card";

export default function InsightsCard({ insights = [] }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        {/* Title */}
        <h3 className="text-base font-semibold text-slate-600">
          Key Insights
        </h3>

        {/* Bullet list */}
        <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-relaxed text-slate-700">
          {insights.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        {/* Footer label */}
        <div className="mt-6 text-xs text-slate-400">
          AI-generated
        </div>
      </CardContent>
    </Card>
  );
}
