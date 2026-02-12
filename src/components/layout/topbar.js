"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { useState } from "react";

export default function Topbar() {

    const [municipality, setMunicipality] = useState("lapu-lapu")
    console.log(municipality)
    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#1F3A5F] text-white">
            <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-8">
                <div className="text-xl font-semibold tracking-tight">System Name</div>

                <div className="flex items-center gap-3">
                <Select defaultValue="lapu-lapu" onValueChange={setMunicipality}>
                    <SelectTrigger className="h-9 w-[170px] border-slate-600 bg-slate-800 text-white">
                    <SelectValue placeholder="Municipality" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="lapu-lapu">Lapu-Lapu City</SelectItem>
                    <SelectItem value="mandaue">Mandaue City</SelectItem>
                    </SelectContent>
                </Select>

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

                <Button
                    variant="ghost"
                    className="h-9 gap-2 text-white hover:bg-slate-700 hover:text-white"
                >
                    <Info className="h-4 w-4" />
                    Help
                </Button>
                </div>
            </div>
        </header>
    );
}
