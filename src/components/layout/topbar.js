"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,  
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function Topbar() {
  const [municipality, setMunicipality] = useState("lapu-lapu");
  console.log(municipality);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#1F3A5F] text-white">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-8">
        <div className="text-xl font-semibold tracking-tight">POLISIGHT</div>

        <div className="flex items-center gap-3">
          {/* <Select defaultValue="lapu-lapu" onValueChange={setMunicipality}>
            <SelectTrigger className="h-9 w-[170px] border-slate-600 bg-slate-800 text-white">
              <SelectValue placeholder="Municipality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lapu-lapu">Lapu-Lapu City</SelectItem>
              <SelectItem value="mandaue">Mandaue City</SelectItem>
            </SelectContent>
          </Select> */}

          <Select defaultValue="2025">
            <SelectTrigger className="h-9 w-[150px] border-slate-600 bg-slate-800 text-white">
              <SelectValue placeholder="Election year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2019">2019</SelectItem>
              <SelectItem value="2016">2016</SelectItem>
            </SelectContent>
          </Select>

          {/* Help Modal Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 gap-2 text-white hover:bg-slate-700 hover:text-white"
              >
                <Info className="h-4 w-4" />
                Help
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Candidate Metrics Guide</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4 text-sm text-slate-700 dark:text-slate-300">
                <p>
                  Below are the definitions for the metrics used to evaluate
                  candidates in the POLISIGHT system:
                </p>

                <div className="space-y-3">
                  <MetricItem
                    title="Vote Share Percentage"
                    desc="The proportion of total votes received by the candidate relative to the total votes cast in the municipality."
                  />
                  <MetricItem
                    title="Incumbency Status"
                    desc="Indicates whether the candidate currently holds the office they are running for. Incumbents often have higher visibility."
                  />
                  <MetricItem
                    title="Social Sentiment Score"
                    desc="An AI-driven analysis of social media mentions, rated from Negative (-100) to Positive (+100)."
                  />
                  <MetricItem
                    title="Engagement Rate"
                    desc="Measures public interaction (likes, shares, comments) per campaign post relative to follower count."
                  />
                  <MetricItem
                    title="Campaign Spend Efficiency"
                    desc="Estimated votes gained per monetary unit spent on campaign activities."
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}

// Helper component for consistent metric styling
function MetricItem({ title, desc }) {
  return (
    <div className="rounded-lg border bg-slate-50 p-3 dark:bg-slate-900">
      <h4 className="font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h4>
      <p className="mt-1 text-slate-600 dark:text-slate-400">{desc}</p>
    </div>
  );
}