// app/page.js
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import CandidateCard from "../data-sources/candidates/candidate-card"
import { useState, useCallback, useEffect } from "react"
import { getCandidates } from "@/services/candidates-service"
import { getCandidateVoteData } from "@/services/candidate-votes-service"
import { booleanFormatter, percentageFormatter, positionRanFormatter } from "@/utils/formatters"
import  ReactMarkdown from "react-markdown";

const forecastData = [
  { model: "Actual Cat", predictedCat: 85, predictedDog: 2, predictedBird: 1 },
  { model: "Actual Dog", predictedCat: 3, predictedDog: 78, predictedBird: 5 },
  { model: "Actual Bird", predictedCat: 2, predictedDog: 4, predictedBird: 72 },
  { model: "Actual Fish", predictedCat: 1, predictedDog: 0, predictedBird: 3 },
]

const markdownText = ` # React Markdown Example

# Some text
- Some other text

## Subtitle

### Additional info

This is a [link](https://github.com/remarkjs/react-markdown)
`;

export default function CandidateTrends() {

    // candidates state
    const [candidates, setCandidates] = useState([])
    const [candidatesError, setCandidatesError] = useState(null);
    const [candidatesLoading, setCandidatesLoading] = useState(true);
    const [candidate, setCandidate] = useState("")

    // candidate vote data states
    const [cvLoading, setCvLoading] = useState(false);
    const [cvError, setCvError] = useState(null);
    const [candidateVoteData, setCandidateVoteData] = useState([])
    const [latestCandidateVoteData, setLatestCandidateVoteData] = useState({})

    const fetchCandidates = useCallback(async () => {
        try {
            setCandidatesLoading(true);
            setCandidatesError(null);
            
            const res = await getCandidates();
            setCandidates(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.log(err);
            setCandidatesError(err);
            setCandidates([]);
        } finally {
            setCandidatesLoading(false);
        }
    }, []);

    const fetchCandidateVoteData = useCallback(async (candidateName) => {
        try{
            setCvLoading(true)
            setCvError(null)

            const res = await getCandidateVoteData({
                candidate: candidateName,
                page_size: 9999
            })
            setCandidateVoteData(Array.isArray(res.data.results) ? res.data.results : []);
        }catch (err){
            console.log(err)
            setCvError(err)
            setCandidateVoteData([])
        }finally{
            setCvLoading(false)
        }
        
    }, [])

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);

    useEffect(() => {
        if (candidateVoteData && candidateVoteData.length > 0) {
            // Sort by election_year descending to ensure we get the most recent
            const sorted = [...candidateVoteData].sort((a, b) => 
                parseInt(b.election_year) - parseInt(a.election_year)
            )
            setLatestCandidateVoteData(sorted[0])
        } else {
            setLatestCandidateVoteData({})
        }
    }, [candidateVoteData])  

    console.log(candidate)
    return (

        
        <div className="space-y-6">

        {/* Main Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Candidate Performance</h1>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Candidate</label>
            <Select 
                value={candidate} 
                onValueChange={(v) => {
                    setCandidate(v);   
                    fetchCandidateVoteData(v.name)
            }}>
                <SelectTrigger className="w-[300px] bg-white">
                    <SelectValue placeholder="Select candidate" />
                </SelectTrigger>
                <SelectContent>
                {
                    candidates.map((candidate) => {
                        return <SelectItem key={candidate.id} value={candidate}>{candidate.name}</SelectItem>
                    })
                }
                </SelectContent>
            </Select>
            </div>
        </div>

        {/* Candidate Info Card */}
        <div className="mb-8">
            <CandidateCard 
                item={candidate}
                showActions={false}
            />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Vote Share Percentage</CardTitle>
            </CardHeader>
            <CardContent>
                {
                    cvLoading ?
                    <div className="font-bold text-gray-900">Loading...</div>
                    :
                    <div className="text-4xl font-bold text-gray-900">{latestCandidateVoteData?.normalized_vs ? `${percentageFormatter(latestCandidateVoteData.normalized_vs)}%` : "-"}</div>
                }
            </CardContent>
            </Card>

            <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Relative Performance Index</CardTitle>
            </CardHeader>
            <CardContent>
                {
                    cvLoading ?
                    <div className="font-bold text-gray-900">Loading...</div>
                    :
                    <div className="text-4xl font-bold text-gray-900">{latestCandidateVoteData?.rpi ? latestCandidateVoteData.rpi : "-"}</div>
                }
            </CardContent>
            </Card>

            <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Turnout Adjustment Factor</CardTitle>
            </CardHeader>
            <CardContent>
                {
                    cvLoading ?
                    <div className="font-bold text-gray-900">Loading...</div>
                    :
                    <div className="text-4xl font-bold text-gray-900">{latestCandidateVoteData?.taf ? latestCandidateVoteData.taf : "-"}</div>
                }
            </CardContent>
            </Card>

            <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Electoral Strength Index</CardTitle>
            </CardHeader>
            <CardContent>
                 {
                    cvLoading ?
                    <div className="font-bold text-gray-900">Loading...</div>
                    :
                    <div className="text-4xl font-bold text-gray-900">{latestCandidateVoteData?.esi ? latestCandidateVoteData.esi : "-"}</div>
                }
            </CardContent>
            </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">ESI Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={candidateVoteData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                        dataKey="election_year" 
                        stroke="#9ca3af" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        />
                        <YAxis 
                        stroke="#9ca3af" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 1]}
                        />
                        <Tooltip />
                        <Line 
                        type="monotone" 
                        dataKey="esi" 
                        stroke="#2563eb" 
                        strokeWidth={2}
                        dot={{ fill: "#2563eb", r: 4 }}
                        />
                    </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle className="text-xl">RPI</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                <LineChart data={candidateVoteData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                    dataKey="election_year" 
                    stroke="#9ca3af" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    />
                    <YAxis 
                    stroke="#9ca3af" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 1.2]}
                    />
                    <Tooltip />
                    <Line 
                    type="monotone" 
                    dataKey="rpi" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={{ fill: "#2563eb", r: 4 }}
                    />
                </LineChart>
                </ResponsiveContainer>
            </CardContent>
            </Card>
        </div>

        {/* Charts Row 2 */}
        <div className=" mb-8">
            <Card>
            <CardHeader>
                <CardTitle className="text-xl">Normalized Vote Share (VS)</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                <LineChart data={candidateVoteData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                    dataKey="election_year" 
                    stroke="#9ca3af" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    />
                    <YAxis 
                    stroke="#9ca3af" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 0.8]}
                    />
                    <Tooltip />
                    <Line 
                    type="monotone" 
                    dataKey="normalized_vs" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={{ fill: "#2563eb", r: 4 }}
                    />
                </LineChart>
                </ResponsiveContainer>
            </CardContent>
            </Card>
        </div>
        
        <div className="mb-8">
            <Card>
                <CardHeader>
                <CardTitle className="text-xl">Forecast (ESI)</CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Prediction Model</TableHead>
                        <TableHead>Next Election Cycle (Year)</TableHead>
                        <TableHead>Forecast ESI</TableHead>
                        <TableHead>Low</TableHead>
                        <TableHead>High</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {forecastData.map((row, index) => (
                        <TableRow key={index}>
                        <TableCell className="font-medium">{row.model}</TableCell>
                        <TableCell>{row.predictedCat}</TableCell>
                        <TableCell>{row.predictedDog}</TableCell>
                        <TableCell>{row.predictedBird}</TableCell>
                        <TableCell>{row.predictedBird}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>
        <div className="mb-8">
            <Card>
                <CardHeader>
                <CardTitle className="text-xl">KPIs by Election</CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Candidate Name</TableHead>
                        <TableHead>TAF</TableHead>
                        <TableHead>Election Year</TableHead>
                        <TableHead>Position Ran</TableHead>
                        <TableHead>Was Incumbent</TableHead>
                        <TableHead>Candidate Votes</TableHead>
                        <TableHead>Total Votes For Position</TableHead>  
                        <TableHead>Is Winner</TableHead>
                        <TableHead>ESI</TableHead>
                        <TableHead>RPI</TableHead>
                        <TableHead>Normalized Vote Share</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {candidateVoteData.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{row.candidate_name}</TableCell>
                            <TableCell>{row.taf}</TableCell>
                            <TableCell>{row.election_year}</TableCell>
                            <TableCell>{positionRanFormatter(row.position_ran)}</TableCell>
                            <TableCell>{booleanFormatter(row.was_incumbent)}</TableCell>
                            <TableCell>{row.candidate_votes}</TableCell>
                            <TableCell>{row.total_votes_for_position}</TableCell>
                            <TableCell>{booleanFormatter(row.is_winner)}</TableCell>
                            <TableCell>{booleanFormatter(row.esi)}</TableCell>
                            <TableCell>{booleanFormatter(row.rpi)}</TableCell>
                            <TableCell>{booleanFormatter(row.normalized_vs)}</TableCell>

                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>

        {/* AI Insight Summary */}
        <Card>
            <CardHeader>
            <CardTitle className="text-2xl">AI Insight Summary</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-2">
                <div className="prose prose-gray max-w-none">
                    <ReactMarkdown>{candidate.ai_insight}</ReactMarkdown>
                </div>
            </div>
            </CardContent>
        </Card>
        </div>
    )
}