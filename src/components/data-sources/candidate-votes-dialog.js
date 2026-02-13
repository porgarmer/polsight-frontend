"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

export default function CandidateVotesDialog({
  open,
  onOpenChange,
  initialValue,
  candidates = ["Ahong Chan", "Cindi Chan"],
  electionYears = ["2025", "2022", "2019", "2016"],
  positions = ["Mayor", "Vice Mayor", "Councilor"],
  onSave
}) {
  const defaults = useMemo(
    () => ({
      id: initialValue?.id || null,
      candidate: initialValue?.candidate || "Ahong Chan",
      electionYear: String(initialValue?.electionYear ?? "2025"),
      positionRan: initialValue?.positionRan || "Mayor",
      wasIncumbent: String(initialValue?.wasIncumbent ?? "true"),
      isWinner: String(initialValue?.isWinner ?? "true"),
      candidateVotes: String(initialValue?.candidateVotes ?? ""),
      totalVotesForPosition: String(initialValue?.totalVotesForPosition ?? "")
    }),
    [initialValue]
  );

  const [form, setForm] = useState(defaults);

  useEffect(() => {
    setForm(defaults);
  }, [defaults]);

  function setField(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function submit() {
    onSave({
      id: form.id,
      candidate: form.candidate,
      electionYear: Number(form.electionYear),
      positionRan: form.positionRan,
      wasIncumbent: form.wasIncumbent === "true",
      isWinner: form.isWinner === "true",
      candidateVotes: Number(form.candidateVotes || 0),
      totalVotesForPosition: Number(form.totalVotesForPosition || 0)
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[620px] max-h-[90vh] overflow-y-auto p-0">
        <div className="rounded-lg bg-white p-6">
          <div className="text-2xl font-semibold text-slate-900">
            Candidate Votes
          </div>

          <div className="mt-5 space-y-5">
            <div className="space-y-2">
              <Label>Candidate</Label>
              <Select
                value={form.candidate}
                onValueChange={(v) => setField("candidate", v)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select candidate" />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Election Year</Label>
              <Select
                value={form.electionYear}
                onValueChange={(v) => setField("electionYear", v)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {electionYears.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Position Ran</Label>
              <Select
                value={form.positionRan}
                onValueChange={(v) => setField("positionRan", v)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Was Incumbent</Label>
              <Select
                value={form.wasIncumbent}
                onValueChange={(v) => setField("wasIncumbent", v)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">True</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Is Winner</Label>
              <Select
                value={form.isWinner}
                onValueChange={(v) => setField("isWinner", v)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">True</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Candidate Votes</Label>
              <Input
                className="h-10"
                value={form.candidateVotes}
                onChange={(e) => setField("candidateVotes", e.target.value)}
                placeholder="6767"
              />
            </div>

            <div className="space-y-2">
              <Label>Total Votes For Position</Label>
              <Input
                className="h-10"
                value={form.totalVotesForPosition}
                onChange={(e) => setField("totalVotesForPosition", e.target.value)}
                placeholder="6767"
              />
            </div>

            <div className="pt-2 space-y-3">
              <Button
                onClick={submit}
                className="h-11 w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Save
              </Button>

              <Button
                onClick={() => onOpenChange(false)}
                className="h-11 w-full bg-orange-500 hover:bg-orange-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
