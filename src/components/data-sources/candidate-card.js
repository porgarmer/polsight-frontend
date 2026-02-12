import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default function CandidateCard({ item, onEdit }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex gap-5 p-5">
        {/* image */}
        <div className="h-[120px] w-[170px] shrink-0 overflow-hidden rounded-md border bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* content */}
        <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xl font-semibold text-slate-900">
              {item.name}
            </div>

            <div className="mt-1 text-sm text-slate-900">
              <span className="font-semibold">Positions ran:</span>{" "}
              {item.positionsRan}
            </div>

            <div className="mt-2 text-sm text-slate-500">
              Related candidates: {item.relatedCandidates}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(item)}
            className="shrink-0 text-slate-600 hover:bg-slate-100"
            aria-label="Edit candidate"
          >
            <Pencil className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
