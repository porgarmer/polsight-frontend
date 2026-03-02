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
import ReactMarkdown from "react-markdown"
import dedent from "dedent";
import remarkGfm from "remark-gfm";
import { logout } from "@/services/auth-service";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const [municipality, setMunicipality] = useState("lapu-lapu");
  const [loading, setLoading] = useState(false);
  console.log(municipality);

  const router = useRouter()

const handleLogout = async () => {
  try {
    // Call backend logout to clear cookies
    await logout()
  } catch (error) {
    console.error('Logout error:', error);
    // Continue with client-side cleanup even if backend call fails
  } finally {
    
    // Redirect to login (client-side navigation)
    router.replace('/login');
  }
};

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

          <Select defaultValue="2025" disabled>
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
                    title="Electoral Strength Index (ESI)"
                    desc={dedent`
                **What it is**  
                A composite index representing a candidate’s overall electoral strength across elections.

                **Formula (simplified)**  
                ESI =  
                - 50% Vote Share  
                - 30% Relative Performance Index  
                - 20% Turnout Adjustment Factor  

                **Typical Range**  
                - Usually between **0.30 – 1.10**  
                - Most candidates fall between **0.40 – 0.85**

                **How to Interpret**

                | ESI Value | Meaning |
                |------------|---------|
                | < 0.40 | Weak electoral presence |
                | 0.40 – 0.60 | Moderate / developing strength |
                | 0.60 – 0.80 | Strong and competitive |
                | > 0.80 | Very strong or dominant |

                **Important**  
                - ESI is **not a percentage**  
                - ESI is **not a probability of winning**  
                - Higher ESI = stronger historical performance
                `}
                  />

                  <MetricItem
                    title="Vote Share (VS)"
                    desc={dedent`
                **What it is**  
                The proportion of valid votes a candidate received in a specific contest.

                **Formula**  
                Vote Share = Candidate Votes ÷ Total Valid Votes for that Position

                **Range**  
                0 to 1 (or 0% to 100%)

                **Interpretation**

                | Vote Share | Meaning |
                |-------------|---------|
                | < 0.30 | Weak support |
                | 0.30 – 0.50 | Competitive |
                | > 0.50 | Majority support |
                | ~1.00 | Uncontested or dominant |
                `}
                  />

                  <MetricItem
                    title="Relative Performance Index (RPI)"
                    desc={dedent`
                **What it is**  
                Measures how close a candidate’s vote share is to the winner’s vote share in the same contest.

                **Formula**  
                RPI = Candidate Vote Share ÷ Winning Vote Share

                **Range**  
                0 to 1  
                (Winner always has **1.00**)

                **Interpretation**

                | RPI | Meaning |
                |------|---------|
                | 1.00 | Winner / top performer |
                | 0.80 – 0.99 | Highly competitive |
                | 0.50 – 0.79 | Moderately competitive |
                | < 0.50 | Weak relative performance |

                RPI measures competitiveness, not popularity alone.
                `}
                  />

                  <MetricItem
                    title="Turnout Rate"
                    desc={dedent`
                **What it is**  
                The proportion of registered voters who cast a ballot.

                **Formula**  
                Turnout = Voters Who Voted ÷ Registered Voters

                **Typical Range**  
                0.60 – 0.90 in most municipalities

                **Interpretation**

                | Turnout | Meaning |
                |----------|---------|
                | < 0.60 | Low participation |
                | 0.60 – 0.75 | Moderate participation |
                | > 0.75 | High participation |
                `}
                  />

                  <MetricItem
                    title="Turnout Adjustment Factor (TAF)"
                    desc={dedent`
                **What it is**  
                Compares current election turnout to the historical average turnout.

                **Formula**  
                TAF = Current Turnout ÷ Historical Average Turnout

                **Typical Range**  
                0.80 – 1.20

                **Interpretation**

                | TAF | Meaning |
                |------|---------|
                | ≈ 1.00 | Normal turnout |
                | > 1.00 | Higher-than-usual turnout |
                | < 1.00 | Lower-than-usual turnout |

                TAF provides context, not causation.
                `}
                  />

                  <MetricItem
                    title="Turnout Volatility (σ)"
                    desc={dedent`
                **What it is**  
                The sample standard deviation of turnout across elections.  
                Measures how stable voter participation is over time.

                **Typical Range**  
                0.00 – 0.08

                **Interpretation**

                | Volatility | Meaning |
                |------------|---------|
                | < 0.03 | Very stable participation |
                | 0.03 – 0.06 | Moderate fluctuation |
                | > 0.06 | Unstable participation environment |
                `}
                  />

                  <MetricItem
                    title="Forecasted ESI"
                    desc={dedent`
                **What it is**  
                Projected next-cycle ESI based on historical trend using linear regression.

                **Important**  
                - It reflects continuation of observed trends  
                - It is **not a guaranteed outcome**
                `}
                  />

                  <MetricItem
                    title="Forecast Range"
                    desc={dedent`
                **What it is**  
                An uncertainty interval around the forecasted ESI based on historical variability.

                **Interpretation**
                - Narrow range → Stable historical trend  
                - Wide range → High historical variability  

                This reflects uncertainty, not best- or worst-case scenarios.
                `}
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
      
          <Button
            onClick={handleLogout}
            disabled={loading ? true : false}
          >
            Logout
          </Button>
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
      <div className="prose prose-gray max-w-none">
        <ReactMarkdown remarkPlugins={remarkGfm}>{desc}</ReactMarkdown>
      </div>
    </div>
  );
}