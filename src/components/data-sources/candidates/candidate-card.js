import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2Icon } from "lucide-react";

export default function CandidateCard({ item, onEdit, onDelete, showActions }) {

  return (
    <Card className="shadow-sm">
      <CardContent className="flex gap-5 p-5">
        {/* image */}
        <div className="h-[120px] w-[170px] shrink-0 overflow-hidden rounded-md border bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.profile}
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
              <span className="font-semibold">Positions held:</span>{" "}
              {item.positions_held}
              {
                console.log(item.positions_held)
              }
            </div>

            {/* <div className="mt-2 text-sm text-slate-500">
              Related candidates: {item.relatedCandidates}
            </div> */}
          </div>
          { showActions ?
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(item)}
                className="shrink-0 text-slate-600 hover:bg-slate-100"
                aria-label="Edit candidate"
              >
                <Pencil className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(item)}
                className="shrink-0 text-slate-600 hover:bg-slate-100"
                aria-label="Edit candidate"
              >
                <Trash2Icon className="h-5 w-5" />
              </Button>
            </div>
            : null
          }
        </div>
      </CardContent>
    </Card>
  );
}
