"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

import ElectionResultsDialog from "./election-results-dialog";
import {
  getElectionResults,
  addElectionResult,
  updateElectionResult,
  deleteElectionResult
} from "@/services/election-results-service";
import { toast } from "sonner";

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

export default function ElectionResultsTab({
  rows,
  count,
  loading,
  error,
  page,
  pageSize,
  setPage,
  setPageSize,
  refetch,
}) {
  const electionYears = useMemo(() => ["2025", "2022", "2019", "2016"], []);

  // dialog state
  const [erOpen, setErOpen] = useState(false);
  const [erEditing, setErEditing] = useState(null);
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

  // ---------- actions ----------
  function openAddElectionResults() {
    setErEditing(null);
    setErOpen(true);
  }

  function openEditElectionResults(row) {
    setErEditing(row);
    setErOpen(true);
  }

  // called by dialog (CREATE/EDIT)
  async function saveElectionResults(payload) {
    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("election_year", payload.electionYear);
      fd.append("registered_voters", payload.registered);
      fd.append("voters_who_voted", payload.voted);

      if (payload.id) {
        await updateElectionResult(payload.id, fd);
      } else {
       
        const res = await addElectionResult(fd);
        setPage(1); // optional: after add, jump to page 1
      }

      await refetch();

      setErOpen(false);
      setErEditing(null);
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
      await deleteElectionResult(deleteTarget.id);

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
    <div className="space-y-4">
      <Button
        onClick={openAddElectionResults}
        className="bg-[#2A9D8F] hover:bg-[#1B7C70]"
      >
        + Add Election Results
      </Button>

      <TableShell>
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead className="border-b bg-slate-50 text-left text-slate-900">
              <tr>
                <th className="px-4 py-3 font-semibold">Election Year</th>
                <th className="px-4 py-3 font-semibold">
                  Number Of Registered Voters
                </th>
                <th className="px-4 py-3 font-semibold">
                  Voters Who Actually Voted
                </th>
                <th className="px-4 py-3 font-semibold">Turnout Percentage</th>
                <th className="px-4 py-3 font-semibold">Turnout Volatility</th>
                <th className="px-4 py-3 font-semibold">Turnout Adjust Factor</th>
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
                  const electionYear = row.election_year;
                  const registered = row.registered_voters;
                  const voted = row.voters_who_voted;

                  const turnoutPct = row.turnout
                    ? `${Math.round(Number(row.turnout) * 100)}%`
                    : "0%";

                  const turnoutVolatility =
                    row.turnout_volatility === null ? "-" : row.turnout_volatility;

                  const turnoutAdjustFactor = row.taf ?? "-";

                  return (
                    <tr
                      key={row.id}
                      className="border-b bg-white transition-colors hover:bg-slate-100"
                    >
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {electionYear}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{registered}</td>
                      <td className="px-4 py-3 text-slate-700">{voted}</td>
                      <td className="px-4 py-3 text-slate-700">{turnoutPct}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {turnoutVolatility}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {turnoutAdjustFactor}
                      </td>
                      <td className="px-4 py-3">
                        <ActionCell
                          onEdit={() =>
                            openEditElectionResults({
                              id: row.id,
                              electionYear,
                              registered,
                              voted
                            })
                          }
                          onDelete={() =>
                            askDelete({
                              id: row.id,
                              electionYear
                            })
                          }
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-2 py-4">
          {/* page size */}
          <div className="w-[120px]">
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(Number(v));
                setPage(1);
              }}
            >
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

          {/* pager */}
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
      </TableShell>

      {/* Create/Edit dialog */}
      <ElectionResultsDialog
        open={erOpen}
        onOpenChange={setErOpen}
        initialValue={erEditing}
        electionYears={electionYears}
        onSave={saveElectionResults}
        saving={saving}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete election result?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the election result for{" "}
              <span className="font-medium text-slate-900">
                {deleteTarget?.electionYear ?? "this year"}
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
