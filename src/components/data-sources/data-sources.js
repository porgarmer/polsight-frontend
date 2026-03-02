"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import CandidateCard from "./candidates/candidate-card";
import CandidateDialog from "./candidates/candidate-dialog";
import { getCandidates, deleteCandidate } from "@/services/candidates-service";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import ElectionResultsTab from "./election-results/election-results-tab";
import CandidateVotesTab from "./candidate-votes/candidate-votes-tab";
import { getElectionResults } from "@/services/election-results-service";
import { getCandidateVoteData } from "@/services/candidate-votes-service";

export default function DataSources() {
  const [tab, setTab] = useState("candidates");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Candidate states
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const familyGroups = useMemo(() => ["Chan", "Radaza"], []);
  //const relatedCandidates = useMemo(() => ["Cindi, Chan"], []);

  
  // Election results state 
  const [erRows, setErRows] = useState([]);
  const [erCount, setErCount] = useState(0);
  const [erLoading, setErLoading] = useState(false);
  const [erError, setErError] = useState(null);
  const [erPage, setErPage] = useState(1);
  const [erPageSize, setErPageSize] = useState(5);
  const [erHasLoaded, setErHasLoaded] = useState(false)

  // Candidate votes states
  const [cvRows, setCvRows] = useState([]);
  const [cvCount, setCvCount] = useState(0);
  const [cvLoading, setCvLoading] = useState(false);
  const [cvError, setCvError] = useState(null);
  const [cvPage, setCvPage] = useState(1);
  const [cvPageSize, setCvPageSize] = useState(5);
  const [cvHasLoaded, setCvHasLoaded] = useState(false)
  const [candidate, setCandidate] = useState("")

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
     
      const res = await getCandidates();
      
      setCandidates(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      setLoadError(err);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchElectionResults = useCallback(async () => {
    try{
      setErLoading(true);
      setErError(null);

      const res = await getElectionResults({
        page: erPage,
        page_size: erPageSize
      });

      setErRows(res.data.results ?? []);
      setErCount(res.data.count ?? 0);
    }catch (e){
      console.log(e);
      setErError(e);
      setErRows([]);
      setErCount(0)
    }finally{
      setErLoading(false)
    }
  }, [erPage, erPageSize])

  const fetchCandidateVotes = useCallback(async () => {
    try {
      setCvLoading(true);
      setCvError(null);
      const res = await getCandidateVoteData({
        page: cvPage,
        page_size: cvPageSize,
        candidate: candidate
      });
      setCvRows(Array.isArray(res.data.results) ? res.data.results : []);
      setCvCount(res.data.count ?? 0);
    } catch (err) {
      console.log(err);
      setCvError(err);
      setCvRows([]);
      setCvCount(0)
    } finally {
      setCvLoading(false);
    }
  }, [candidate, cvPage, cvPageSize]);
  

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  useEffect(() => {
    if (tab !== "election-results") return;
    if (erHasLoaded) return;
    fetchElectionResults().then(() => setErHasLoaded(true))
  }, [tab, erHasLoaded, fetchElectionResults])

  useEffect(() => {
    if (tab !== "candidate-votes") return;
    //if (cvHasLoaded) return;
    fetchCandidateVotes()
  }, [tab, cvHasLoaded, fetchCandidateVotes, candidate])

  function onAddCandidate() {
    setEditing(null);
    setOpen(true);
  }

  function onEditCandidate(item) {
    setEditing(item);
    setOpen(true);
  }

  // ✅ open confirm dialog
  function onAskDelete(item) {
    setDeleteTarget(item);
    setDeleteOpen(true);
  }

  // ✅ confirm delete
  async function onConfirmDelete() {
    if (!deleteTarget?.id) return;

    try {
      setDeleting(true);
      await deleteCandidate(deleteTarget.id);
      await fetchCandidates();
      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      console.log(err);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between">
          <TabsList className="bg-transparent p-0">
            <TabsTrigger
              value="candidates"
              className="rounded-none border-b-2 border-transparent px-8 py-2 text-slate-700 data-[state=active]:border-[#2A9D8F] data-[state=active]:text-[#2A9D8F]"
            >
              Candidates  
            </TabsTrigger>
            <TabsTrigger
              value="election-results"
              className="rounded-none border-b-2 border-transparent px-8 py-2 text-slate-700 data-[state=active]:border-[#2A9D8F] data-[state=active]:text-[#2A9D8F]"
            >
              Election Results
            </TabsTrigger>
            <TabsTrigger
              value="candidate-votes"
              className="rounded-none border-b-2 border-transparent px-8 py-2 text-slate-700 data-[state=active]:border-[#2A9D8F] data-[state=active]:text-[#2A9D8F]"
            >
              Candidate Votes
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="candidates" className="space-y-5">
          <Button
            onClick={onAddCandidate}
            className="w-fit bg-[#2A9D8F] hover:bg-[#1B7C70]"
          >
            + Add Candidate
          </Button>

          <div className="space-y-5">
            {loading ? (
              <div className="text-sm text-slate-500">Loading...</div>
            ) : loadError ? (
              <div className="text-sm text-red-600">Failed to load candidates.</div>
            ) : (
              candidates.map((c) => (
                <CandidateCard
                  key={c.id}
                  item={c}
                  onEdit={onEditCandidate}
                  onDelete={onAskDelete}
                  showActions={true}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="election-results" className="space-y-5">
          <ElectionResultsTab 
            rows={erRows}
            count={erCount}
            loading={erLoading}
            error={erError}
            page={erPage}
            pageSize={erPageSize}
            setPage={setErPage}
            setPageSize={setErPageSize}
            refetch={fetchElectionResults}
          />
        </TabsContent>
  
        <TabsContent value="candidate-votes" className="space-y-5">
          <CandidateVotesTab
            rows={cvRows}
            count={cvCount}
            loading={cvLoading}
            error={cvError}
            page={cvPage}
            pageSize={cvPageSize}
            setPage={setCvPage}
            setPageSize={setCvPageSize}
            refetch={fetchCandidateVotes}
            setCandidate={setCandidate}
            candidate={candidate}
            candidates={candidates}
          />
        </TabsContent>
      </Tabs>

      <CandidateDialog
        open={open}
        onOpenChange={setOpen}
        initialValue={editing}
        familyGroups={familyGroups}
        //relatedCandidates={relatedCandidates}
        onRefresh={fetchCandidates}
      />

      {/* ✅ confirmation dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete candidate?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-slate-900">
                {deleteTarget?.name || "this candidate"}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmDelete}
              disabled={deleting}
              className="bg-[#E76F51] hover:bg-[#D9684C]"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
