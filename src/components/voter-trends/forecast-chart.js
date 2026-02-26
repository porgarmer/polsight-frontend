"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend 
} from "recharts";

export default function ForecastChart({
  data,
  title,
  dataKey
}) {
  const [metric, setMetric] = useState("expected_voters");

  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    
    // ✅ Reverse: newest → oldest (e.g., 2025, 2022, 2019, 2016)
    return [...data].reverse();
    
    // 🔄 Or sort chronologically (oldest → newest):
    // return [...data].sort((a, b) => 
    //   Number(a.election_year) - Number(b.election_year)
    // );
  }, [data]); // ⚠️ Was [metric] — but metric doesn't affect data transformation!

  const COLORS = {
    registered: "#6366F1",
    voted: "#F97316",
    turnout: "#06B6D4"
  };

  console.log("📊 Raw data:", data);
  console.log("📊 Chart data (reversed):", chartData);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-slate-700">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="h-[420px] p-6 pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="election_year" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line 
              type="monotone" 
              dataKey="turnout" 
              stroke={COLORS.registered} 
              strokeWidth={2} 
              dot={{ r: 4 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}