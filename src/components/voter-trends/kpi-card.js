import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp } from "lucide-react";

export default function KpiCard({
  title,
  value,
  delta,
  subLabel,
  subValue,
  subYear
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="text-sm font-medium text-slate-600">{title}</div>

        <div className="mt-2 flex items-end justify-between">
          <div className="text-4xl font-semibold tracking-tight">{value}</div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
              <ArrowUp className="h-4 w-4" />
              {delta}
            </div>

            <div className="border-l pl-4">
              <div className="text-xs text-slate-500">{subLabel}</div>
              <div className="text-sm font-semibold">{subValue}</div>
              <div className="text-xs text-slate-500">{subYear}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
