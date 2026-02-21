"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { toast } from "sonner";
import CandidateVotesDialog from "./candidate-votes-dialog";

import { booleanFormatter, positionRanFormatter } from "@/utils/formatters"
import { addCandidateVoteData, deleteCandidateVoteData, updateCandidateVoteData } from "@/services/candidate-votes-service";

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


const MOCK_CANDIDATE_VOTES = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  candidate: "Ahong Chan",
  electionYear: 2025,
  positionRan: "Mayor",
  wasIncumbent: true,
  isWinner: true,
  candidateVotes: 6767,
  totalVotesForPosition: 6767
}));

function TableShell({ children }) {
  return (
    <div className="w-full overflow-hidden rounded-md border bg-white">
      {children}
    </div>
  );
}

function ActionCell({ onEdit, onDelete }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-8 w-[130px] rounded-md border bg-white px-3 text-xs text-slate-500 shadow-sm hover:bg-slate-50">
          <div className="flex items-center justify-between">
            <span>Action</span>
            <span className="text-slate-700">▾</span>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[120px] rounded-md border bg-white p-4 shadow-lg"
      >
        <div className="space-y-3">
          <Button
            onClick={onEdit}
            className="w-full bg-amber-400 text-white hover:bg-amber-500"
          >
            Edit
          </Button>
          <Button
            onClick={onDelete}
            className="w-full bg-orange-500 text-white hover:bg-orange-600"
          >
            Delete
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PaginationBar({ 
  pageSize, 
  setPageSize, 
  canPrev, 
  canNext, 
  currentPage,
  pageCount,
  setPage
}) {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="w-[120px]">
        <Select               
          value={String(pageSize)}
          onValueChange={(v) => {
          setPageSize(Number(v));
        }}>
          <SelectTrigger className="h-8 w-[70px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key={5} value="5">5</SelectItem>
            <SelectItem key={10} value="10">10</SelectItem>
            <SelectItem key={20} value="20">20</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500">
        <button
          className={`flex items-center gap-2 ${
            canPrev ? "hover:text-slate-800" : "opacity-50"
          }`}
          disabled={!canPrev}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          <span>←</span> Previous
        </button>

        <div className="flex items-center gap-2">
          <button className="flex h-7 items-center justify-center rounded bg-emerald-600 px-3 text-white">
            {currentPage}
          </button>
          <span className="text-slate-400">/</span>
          <span>{pageCount}</span>
        </div>


        <button
          className={`flex items-center gap-2 ${
            canNext ? "hover:text-slate-800" : "opacity-50"
          }`}
          disabled={!canNext}
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
        >
          Next <span>→</span>
        </button>
      </div>

      <div className="w-[120px]" />
    </div>
  );
}

export default function CandidateVotesTab({
  rows,
  count,
  loading,
  error,
  page,
  pageSize,
  setPage,
  setPageSize,
  refetch,
  candidates,
  setCandidate,
  candidate,
}) {
  const electionYears = useMemo(() => ["2025", "2022", "2019", "2016"], []);
  const positions = useMemo(() => ["Mayor", "Congressman", "Vice Mayor"], []);

  // candidate votes dialog state
  const [cvOpen, setCvOpen] = useState(false);
  const [cvEditing, setCvEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  // delete confirm state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

    // ---------- pagination derived ----------
  const pageCount = Math.max(1, Math.ceil(count / pageSize));
  const currentPage = Math.min(page, pageCount);
  const canPrev = currentPage > 1;
  const canNext = currentPage < pageCount;

  function openAddCandidateVotes() {
    setCvEditing(null);
    setCvOpen(true);
  }
  function openEditCandidateVotes(row) {
    setCvEditing(row);
    setCvOpen(true);
  }

  async function saveCandidateVotes(payload) {
    // setCandidateVotes((prev) => {
    //   if (payload.id) {
    //     return prev.map((x) => (x.id === payload.id ? payload : x));
    //   }
    //   const nextId = Math.max(0, ...prev.map((p) => p.id)) + 1;
    //   return [{ ...payload, id: nextId }, ...prev];
    // });
    // setCvOpen(false);
    // setCvEditing(null);
    try{
      setSaving(true)

      const fd = new FormData();
      fd.append("election_year", payload.electionYear);
      fd.append("candidate", payload.candidate);
      fd.append("was_incumbent", payload.wasIncumbent); 
      fd.append("is_winner", payload.isWinner); 
      fd.append("candidate_votes", payload.candidateVotes); 
      fd.append("position_ran", payload.positionRan); 
      fd.append("total_votes_for_position", payload.totalVotesForPosition); 

      if (payload.id) {
        await updateCandidateVoteData(payload.id, fd);
      } else {
        
        const res = await addCandidateVoteData(fd);
        setPage(1); // optional: after add, jump to page 1
      }

      await refetch();

      setCvOpen(false);
      setCvEditing(null);
    } catch (err) {
      toast(err.response?.data.detail || err.message)
    } finally {
      setSaving(false);
    }
  }

  function askDelete(row) {
    setDeleteTarget(row);
    setDeleteOpen(true);
  }

  async function confirmDelete() {
    if (!deleteTarget?.id) return;

    try {
      setDeleting(true);
      await deleteCandidateVoteData(deleteTarget.id);

      // if we deleted the last row on the last page, step back a page
      const nextTotal = Math.max(0, count - 1);
      const nextPageCount = Math.max(1, Math.ceil(nextTotal / pageSize));
      if (page > nextPageCount) setPage(nextPageCount);

      await refetch();

      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      console.log(err);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-14">
      <section className="space-y-4">
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between">

          <Button
            onClick={openAddCandidateVotes}
            className="bg-[#2A9D8F] hover:bg-[#1B7C70]"
          >
            + Add Candidate Votes
          </Button>
          <Select 
          value={candidate} 
          onValueChange={(v) => {
            setCandidate(v === "all" ? "" : v);
          }}>
              <SelectTrigger className="h-9 w-[170px] bg-white ">
                <SelectValue placeholder="Select Candidate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {
                  candidates.map((c) => {
                     return <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  })
                }
              </SelectContent>
          </Select>
        </div>

        <TableShell>
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead className="border-b bg-slate-50 text-left text-slate-900">
                <tr>
                  <th className="px-4 py-3 font-semibold">Election Year</th>
                  <th className="px-4 py-3 font-semibold">Candidate Name</th>
                  <th className="px-4 py-3 font-semibold">Position Ran</th>
                  <th className="px-4 py-3 font-semibold">Was Incumbent</th>
                  <th className="px-4 py-3 font-semibold">Candidate Votes</th>
                  <th className="px-4 py-3 font-semibold">
                    Total Votes For Position
                  </th>
                  <th className="px-4 py-3 font-semibold">Is Winner</th>
                  <th className="px-4 py-3 font-semibold">ESI</th>
                  <th className="px-4 py-3 font-semibold">RPI</th>
                  <th className="px-4 py-3 font-semibold">Normalized VS</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={7}>
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td className="px-4 py-4 text-red-600" colSpan={7}>
                    Failed to load election results.
                  </td>
                </tr>
              ) : count === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={7}>
                    No data.
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const candidateName = row.candidate_name
                  const electionYear = row.election_year

                  return (
                    <tr
                      key={row.id}
                      className="border-b bg-white transition-colors hover:bg-slate-100"
                    >
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {row.election_year}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{row.candidate_name}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {positionRanFormatter(row.position_ran)}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {booleanFormatter(row.was_incumbent)}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {row.candidate_votes}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {row.total_votes_for_position}
                      </td>

                      {/* You had 2 "Is Winner" columns in the screenshot */}
                      <td className="px-4 py-3 text-slate-700">
                        {booleanFormatter((row.is_winner))}
                      </td>

                      {/* placeholders, same as screenshot */}
                      <td className="px-4 py-3 text-slate-700">{row.esi}</td>
                      <td className="px-4 py-3 text-slate-700">{row.rpi}</td>
                      <td className="px-4 py-3 text-slate-700">{row.normalized_vs}</td>

                      <td className="px-4 py-3">
                        <ActionCell
                          onEdit={() => 
                            openEditCandidateVotes({
                              id: row.id,
                              electionYear: row.election_year,
                              candidate: row.candidate,
                              positionRan: row.position_ran,
                              wasIncumbent: row.was_incumbent,
                              isWinner: row.is_winner,
                              candidateVotes: row.candidate_votes,
                              totalVotesForPosition: row.total_votes_for_position
                            })
                          
                          }
                          onDelete={() =>
                            askDelete({
                              id: row.id,
                              electionYear,
                              candidateName
                            })
                          }
                        />
                      </td>
                    </tr>
                  );
                })
              )};
              </tbody>
            </table>
          </div>

          <PaginationBar
            pageSize={pageSize}
            setPageSize={setPageSize}
            canPrev={canPrev}
            canNext={canNext}
            currentPage={currentPage}
            pageCount={pageCount}
            setPage={setPage}
          />
        </TableShell>
      </section>

      <CandidateVotesDialog
        open={cvOpen}
        onOpenChange={setCvOpen}
        initialValue={cvEditing}
        candidates={candidates}
        electionYears={electionYears}
        positions={positions}
        onSave={saveCandidateVotes}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete candidate vote data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the vote data for{" "}
              <span className="font-medium text-slate-900">
                {deleteTarget?.candidateName ?? "this candidate"}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
