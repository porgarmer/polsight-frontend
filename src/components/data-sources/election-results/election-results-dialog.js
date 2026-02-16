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

export default function ElectionResultsDialog({
  open,
  onOpenChange,
  initialValue,
  electionYears = [2025, 2022, 2019, 2016],
  onSave
}) {
  const defaults = useMemo(
    () => ({
      id: initialValue?.id || null,
      electionYear: String(initialValue?.electionYear ?? "2025"),
      registered: String(initialValue?.registered ?? ""),
      voted: String(initialValue?.voted ?? "")
    }),
    [initialValue]
  );

  const [form, setForm] = useState(defaults);
  const [registeredVotersError, setRegisteredVotersError] = useState("")
  const [votersWhoActuallyVotedError, setVotersWhoActuallyVotedError] = useState("")

  useEffect(() => {
    if (!open) return;
    setForm(defaults);
  }, [open, defaults]);


  function setField(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function submit() {
    if (!form.registered){
      setRegisteredVotersError("Number of regisetered voters are required.");
      return;
    }else if(!form.voted){
      setVotersWhoActuallyVotedError("Number of actual voters required.");
      return;
    }

    onSave({
      id: form.id,
      electionYear: Number(form.electionYear),
      registered: Number(form.registered || 0),
      voted: Number(form.voted || 0)
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[620px] p-0">
        <div className="rounded-lg bg-white p-6">
          <div className="text-2xl font-semibold text-slate-900">
            Election Results
          </div>

          <div className="mt-5 space-y-5">
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
              <Label>Registered Voters</Label>
              <Input
                type="number"
                className="h-10"
                value={form.registered}
                onChange={(e) => setField("registered", e.target.value)}
              />
              {registeredVotersError ? (
                <div className="text-xs text-red-600">{registeredVotersError}</div>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>Voters Who Actually Voted</Label>
              <Input
                type="number"
                className="h-10"
                value={form.voted}
                onChange={(e) => setField("voted", e.target.value)}
              />
              {votersWhoActuallyVotedError ? (
                <div className="text-xs text-red-600">{votersWhoActuallyVotedError}</div>
              ) : null}
            </div>

            <div className="pt-2 space-y-3">
              <Button
                onClick={submit}
                className="h-10 w-full bg-[#2A9D8F] hover:bg-[#1B7C70]"
              >
                Save
              </Button>

              <Button
                onClick={() => onOpenChange(false)}
                className="h-10 w-full bg-[#E76F51] hover:bg-[#D9684C]"
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
