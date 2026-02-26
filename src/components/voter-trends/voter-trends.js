'use client';

import KpiCard from "@/components/voter-trends/kpi-card";
import ForecastChart from "@/components/voter-trends/forecast-chart";
import InsightsCard from "@/components/insights-card";
import { useState, useCallback, useEffect } from 'react'
import { getElectionResults } from "@/services/election-results-service";
import { use } from "marked";
import { percentageFormatter } from "@/utils/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
export default function VoterTrendsPage() {
    const [loading, setLoading] = useState(false)
    const [electionResults, setElectionResults] = useState([])
    const [electionResultsError, setElectionResultsError] = useState("")
    const [latestElectionResult, setLatestElectionResult] = useState({})

    const fetchElectionResults = useCallback(async () => {
        try {
            setLoading(true)
            setElectionResultsError(null)

            const res = await getElectionResults({ page_size: 9999 })

            // ✅ Extract results once, use for both state updates
            const results = Array.isArray(res.data?.results) ? res.data.results : []
            
            setElectionResults(results)
            setLatestElectionResult(results[0] || {})  // ✅ Use the new data directly

            // ✅ Fix: Check results length, not res.data == []
            if (results.length === 0) {
                setElectionResultsError("No election data.")
            }
        } catch (err) {
            console.error(err)
            setElectionResultsError(err.message || "Failed to fetch election results")
        } finally {
            setLoading(false)
        }
    }, [])
    
    useEffect(() => {
        fetchElectionResults()
    }, [fetchElectionResults])

    return (
        
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Voter Trends</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard
                    title="Registered Voters"
                    value={
                        loading 
                            ? "Loading..." 
                            : electionResultsError 
                                ? electionResultsError 
                                : latestElectionResult?.registered_voters?.toLocaleString() ?? "-"
                    }
                />
                <KpiCard
                    title="Voters Who Voted"
                    value={
                        loading 
                            ? "Loading..." 
                            : electionResultsError 
                                ? electionResultsError 
                                : latestElectionResult?.voters_who_voted?.toLocaleString() ?? "-"
                    }
                />
                <KpiCard
                    title="Turnout"
                    value={
                        loading 
                            ? "Loading..." 
                            : electionResultsError 
                                ? electionResultsError 
                                : `${percentageFormatter(latestElectionResult?.turnout)}%` ?? "-"
                    }
                />
                <KpiCard
                    title="Turnout Adjustment Factor"
                    value={
                        loading 
                            ? "Loading..." 
                            : electionResultsError 
                                ? electionResultsError 
                                : latestElectionResult?.taf ?? "-"
                    }
                />
            </div>

            <ForecastChart 
                data={electionResults}
                title={"Turnout Trend"}
                dataKey={"turnout"}
            />
            <div className="mb-8">
                <Card>
                    <CardHeader>
                    <CardTitle className="text-xl">Election Results Table</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Election Year</TableHead>
                            <TableHead>Registered Voters</TableHead>
                            <TableHead>Voters Who Voted</TableHead>
                            <TableHead>Turnout</TableHead>
                            <TableHead>Turnout Volatility</TableHead>  
                            <TableHead>Turnout Adjust Factor</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {electionResults.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.election_year}</TableCell>
                                <TableCell>{row.registered_voters}</TableCell>
                                <TableCell>{row.voters_who_voted}</TableCell>
                                <TableCell>{percentageFormatter(row.turnout)}%</TableCell>
                                <TableCell>{row.turnout_volatility}</TableCell>
                                <TableCell>{row.taf}</TableCell>
    
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </CardContent>
                </Card>
            </div>
            {/* <InsightsCard
                insights={[
                "Voter turnout is projected to increase by 2% in 2028.",
                "Historical data shows strong performance during high-registration years.",
                "Turnout dips appear correlated with off-cycle election fatigue.",
                "Registered voter growth remains stable across the last three cycles.",
                ]}
            /> */}
        </div>
    );
}
