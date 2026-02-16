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

export default function DataSources() {
  const [tab, setTab] = useState("candidates");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // delete confirmation state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const familyGroups = useMemo(() => ["Chan", "Radaza"], []);
  const relatedCandidates = useMemo(() => ["Cindi, Chan"], []);

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

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

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
          <ElectionResultsTab />
        </TabsContent>
  
        <TabsContent value="candidate-votes" className="space-y-5">
          <CandidateVotesTab />
        </TabsContent>
      </Tabs>

      <CandidateDialog
        open={open}
        onOpenChange={setOpen}
        initialValue={editing}
        familyGroups={familyGroups}
        relatedCandidates={relatedCandidates}
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
