"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const DATA = [
  { year: 2016, registered: 38, voted: 88, turnout: 148 },
  { year: 2019, registered: 62, voted: 98, turnout: 195 },
  { year: 2022, registered: 25, voted: 44, turnout: 88 },
  { year: 2025, registered: 60, voted: 128, turnout: 175 }
];

export default function ForecastChart() {
    const [metric, setMetric] = useState("expected_voters");

    const chartData = useMemo(() => {
        // In your real app: map your API response here depending on metric.
        return DATA;
    }, [metric]);

    const COLORS = {
        registered: "#6366F1",
        voted: "#F97316",
        turnout: "#06B6D4"
    };


    return (
        <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-700">
            Forecast Trends
            </CardTitle>

            <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="h-9 w-[220px]">
                <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="expected_voters">Expected Voters To Vote</SelectItem>
                <SelectItem value="registered">Registered Voters</SelectItem>
                <SelectItem value="voted">Voters Who Voted</SelectItem>
                <SelectItem value="turnout">Turnout Percentage</SelectItem>
            </SelectContent>
            </Select>
        </CardHeader>

        <CardContent className="h-[420px] p-6 pt-0">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line type="monotone" dataKey="registered" stroke={COLORS.registered} strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="voted" stroke={COLORS.voted} strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="turnout" stroke={COLORS.turnout} strokeWidth={2} dot={{ r: 4 }} />

            </LineChart>
            </ResponsiveContainer>
        </CardContent>
        </Card>
    );
}
