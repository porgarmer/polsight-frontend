"use client";

import { useMemo, useState } from "react";
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

import CandidateVotesDialog from "./candidate-votes-dialog";

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

function PaginationBar() {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="w-[120px]">
        <Select defaultValue="5">
          <SelectTrigger className="h-8 w-[70px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500">
        <button className="flex items-center gap-2 opacity-50">
          <span>←</span> Previous
        </button>

        <button className="flex h-7 w-7 items-center justify-center rounded bg-emerald-600 text-white">
          1
        </button>
        <button className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-100">
          2
        </button>

        <button className="flex items-center gap-2 opacity-50">
          Next <span>→</span>
        </button>
      </div>

      <div className="w-[120px]" />
    </div>
  );
}

export default function CandidateVotesTab() {
  const electionYears = useMemo(() => ["2025", "2022", "2019", "2016"], []);
  const candidates = useMemo(() => ["Ahong Chan", "Cindi Chan"], []);
  const positions = useMemo(() => ["Mayor", "Vice Mayor", "Councilor"], []);

  const [candidateVotes, setCandidateVotes] = useState(MOCK_CANDIDATE_VOTES);

  // candidate votes dialog state
  const [cvOpen, setCvOpen] = useState(false);
  const [cvEditing, setCvEditing] = useState(null);

  function openAddCandidateVotes() {
    setCvEditing(null);
    setCvOpen(true);
  }
  function openEditCandidateVotes(row) {
    setCvEditing(row);
    setCvOpen(true);
  }
  function saveCandidateVotes(payload) {
    setCandidateVotes((prev) => {
      if (payload.id) {
        return prev.map((x) => (x.id === payload.id ? payload : x));
      }
      const nextId = Math.max(0, ...prev.map((p) => p.id)) + 1;
      return [{ ...payload, id: nextId }, ...prev];
    });
    setCvOpen(false);
    setCvEditing(null);
  }

  return (
    <div className="space-y-14">
      <section className="space-y-4">
        <div className="space-y-3">

          <Button
            onClick={openAddCandidateVotes}
            className="bg-[#2A9D8F] hover:bg-[#1B7C70]"
          >
            + Add Candidate Votes
          </Button>
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
                {candidateVotes.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b bg-white transition-colors hover:bg-slate-100"
                  >
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {row.electionYear}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{row.candidate}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {row.positionRan}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {String(row.wasIncumbent)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {row.candidateVotes}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {row.totalVotesForPosition}
                    </td>

                    {/* You had 2 "Is Winner" columns in the screenshot */}
                    <td className="px-4 py-3 text-slate-700">
                      {String(row.isWinner)}
                    </td>

                    {/* placeholders, same as screenshot */}
                    <td className="px-4 py-3 text-slate-700">67%</td>
                    <td className="px-4 py-3 text-slate-700">67%</td>
                    <td className="px-4 py-3 text-slate-700">67%</td>

                    <td className="px-4 py-3">
                      <ActionCell
                        onEdit={() => openEditCandidateVotes(row)}
                        onDelete={() => {}}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationBar />
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
    </div>
  );
}
