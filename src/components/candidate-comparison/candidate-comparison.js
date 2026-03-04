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
import remarkGfm from "remark-gfm"

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

export default function CandidateComparisonPage() {

    // candidates state
    const [candidates, setCandidates] = useState([])
    const [candidatesError, setCandidatesError] = useState(null);
    const [candidatesLoading, setCandidatesLoading] = useState(true);
    const [candidate, setCandidate] = useState("")


    //candidates state 2
    const [candidates2, setCandidates2] = useState([])
    const [candidatesError2, setCandidatesError2] = useState(null);
    const [candidatesLoading2, setCandidatesLoading2] = useState(true);
    const [candidate2, setCandidate2] = useState("")

    // candidate vote data states
    const [cvLoading, setCvLoading] = useState(false);
    const [cvError, setCvError] = useState(null);
    const [candidateVoteData, setCandidateVoteData] = useState([])
    const [latestCandidateVoteData, setLatestCandidateVoteData] = useState({})

    // candidate vote data states 2
    const [cvLoading2, setCvLoading2] = useState(false);
    const [cvError2, setCvError2] = useState(null);
    const [candidateVoteData2, setCandidateVoteData2] = useState([])
    const [latestCandidateVoteData2, setLatestCandidateVoteData2] = useState({})

    const fetchCandidates = useCallback(async () => {
        try {
            setCandidatesLoading(true);
            setCandidatesError(null);
            
            const res = await getCandidates();
            setCandidates(Array.isArray(res.data) ? res.data : []);
            setCandidates2(Array.isArray(res.data) ? res.data : []);
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
            console.log(err);
            setCvError(err);
            setCandidateVoteData([])
        }finally{
            setCvLoading(false)
        }
        
    }, [])

    const fetchCandidateVoteData2 = useCallback(async (candidateName) => {
        try{
            setCvLoading2(true)
            setCvError2(null)

            const res = await getCandidateVoteData({
                candidate: candidateName,
                page_size: 9999
            })
            setCandidateVoteData2(Array.isArray(res.data.results) ? res.data.results : []);
        }catch (err){
            console.log(err)
            setCvError2(err)
            setCandidateVoteData2([])
        }finally{
            setCvLoading2(false)
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

    return (
        <div className="space-y-6">
            {/* Main Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Candidate Comparison</h1>
            
            {/* Header */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Candidate</label>
                    <Select 
                        value={candidate2} 
                        onValueChange={(v) => {  
                            setCandidate2(v); 
                            fetchCandidateVoteData2(v.name)
                    }}>
                        <SelectTrigger className="w-[300px] bg-white">
                            <SelectValue placeholder="Select candidate" />
                        </SelectTrigger>
                        <SelectContent>
                        {
                            candidates2.map((candidate2) => {
                                return <SelectItem key={candidate2.id} value={candidate2}>{candidate2.name}</SelectItem>
                            })
                        }
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Candidate Info Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <CandidateCard 
                    item={candidate}
                    showActions={false}
                />

                <CandidateCard 
                    item={candidate2}
                    showActions={false}
                />
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
                    <CardTitle className="text-xl">ESI Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={candidateVoteData2}>
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
            </div>

             {/* Achievements Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                    <CardHeader>
                    <CardTitle className="text-2xl">{candidate.name}'s Achievements</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-2">
                        <div className="prose prose-gray max-w-none">
                            <ReactMarkdown remarkPlugins={remarkGfm}>{candidate.achievement}</ReactMarkdown>
                        </div>
                    </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                    <CardTitle className="text-2xl">{candidate2.name}'s Achievements</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-2">
                        <div className="prose prose-gray max-w-none">
                            <ReactMarkdown remarkPlugins={remarkGfm}>{candidate2.achievement}</ReactMarkdown>
                        </div>
                    </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                    <CardHeader>
                    <CardTitle className="text-2xl">{candidate.name}'s Social Media Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-2">
                        <div className="prose prose-gray max-w-none">
                            <ReactMarkdown remarkPlugins={remarkGfm}>{candidate.social_media_activity}</ReactMarkdown>
                        </div>
                    </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                    <CardTitle className="text-2xl">{candidate2.name}'s Social Media Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-2">
                        <div className="prose prose-gray max-w-none">
                            <ReactMarkdown remarkPlugins={remarkGfm}>{candidate2.social_media_activity}</ReactMarkdown>
                        </div>
                    </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}