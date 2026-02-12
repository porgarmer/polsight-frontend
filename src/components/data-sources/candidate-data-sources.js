"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import CandidateCard from "./candidate-card";
import CandidateDialog from "./candidate-dialog";

const MOCK_CANDIDATES = [
  {
    id: 1,
    name: "Chan, Ahong",
    positionsRan: "Mayor (2019-2022), Congressman (2025)",
    relatedCandidates: "Chan, Cindi",
    imageUrl:
      "https://placehold.co/220x220/png?text=Holy+Moly"
  },
  {
    id: 2,
    name: "Chan, Ahong",
    positionsRan: "Mayor (2019-2022), Congressman (2025)",
    relatedCandidates: "Chan, Cindi",
    imageUrl:
      "https://placehold.co/220x220/png?text=Holy+Moly"
  },
  {
    id: 3,
    name: "Chan, Ahong",
    positionsRan: "Mayor (2019-2022), Congressman (2025)",
    relatedCandidates: "Chan, Cindi",
    imageUrl:
      "https://placehold.co/220x220/png?text=Holy+Moly"
  }
];

export default function CandidateDataSources() {
  const [tab, setTab] = useState("candidates");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [candidates, setCandidates] = useState(MOCK_CANDIDATES);

  const familyGroups = useMemo(() => ["Cindi, Chan"], []);
  const relatedCandidates = useMemo(() => ["Cindi, Chan"], []);

  function onAddCandidate() {
    setEditing(null);
    setOpen(true);
  }

  function onEditCandidate(item) {
    setEditing(item);
    setOpen(true);
  }

  function onSave(payload) {
    setCandidates((prev) => {
      if (payload.id) {
        return prev.map((x) => (x.id === payload.id ? payload : x));
      }
      const nextId = Math.max(0, ...prev.map((p) => p.id)) + 1;
      return [{ ...payload, id: nextId }, ...prev];
    });
    setOpen(false);
    setEditing(null);
  }

  return (
    
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={setTab}>
        {/* tabs row */}
        <div className="flex items-center justify-between">
          <TabsList className="bg-transparent p-0">
            <TabsTrigger
              value="candidates"
              className="rounded-none border-b-2 border-transparent px-8 py-2 text-slate-700 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600"
            >
              Candidates
            </TabsTrigger>
            <TabsTrigger
              value="voter-data"
              className="rounded-none border-b-2 border-transparent px-8 py-2 text-slate-700 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600"
            >
              Voter Data
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="candidates" className="space-y-5">
          <Button
            onClick={onAddCandidate}
            className="w-fit bg-emerald-600 hover:bg-emerald-700"
          >
            + Add Candidate
          </Button>

          <div className="space-y-5">
            {candidates.map((c) => (
              <CandidateCard key={c.id} item={c} onEdit={onEditCandidate} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="voter-data" className="space-y-5">
          {/* as per your screenshot: just a tab header for now */}
        </TabsContent>
      </Tabs>

      <CandidateDialog
        open={open}
        onOpenChange={setOpen}
        initialValue={editing}
        familyGroups={familyGroups}
        relatedCandidates={relatedCandidates}
        onSave={onSave}
      />
    </div>
  );
}
