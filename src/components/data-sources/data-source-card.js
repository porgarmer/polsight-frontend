import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

function statusBadge(status) {
  if (status === "Verified") return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
  if (status === "Needs review") return "bg-amber-100 text-amber-800 hover:bg-amber-100";
  return "bg-slate-100 text-slate-700 hover:bg-slate-100";
}

function filePill(fileType) {
  return (fileType || "").toUpperCase();
}

export default function DataSourceCard({ item, onEdit }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex gap-5 p-5">
        {/* left preview box (image/icon placeholder) */}
        <div className="h-[110px] w-[150px] shrink-0 overflow-hidden rounded-lg border bg-slate-50">
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
            {filePill(item.fileType) || "FILE"}
          </div>
        </div>

        {/* main content */}
        <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="truncate text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <Badge className={statusBadge(item.status)}>{item.status}</Badge>
            </div>

            <div className="mt-1 text-sm text-slate-700">{item.description}</div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span>
                <span className="font-medium text-slate-600">Publisher:</span>{" "}
                {item.publisher || "—"}
              </span>
              <span>
                <span className="font-medium text-slate-600">Year:</span>{" "}
                {item.year || "—"}
              </span>
              <span>
                <span className="font-medium text-slate-600">Updated:</span>{" "}
                {item.updatedAt || "—"}
              </span>
              <span className="truncate">
                <span className="font-medium text-slate-600">File:</span>{" "}
                {item.fileName || "—"}
              </span>
            </div>
          </div>

          {/* edit button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(item)}
            className="shrink-0 text-slate-600 hover:bg-slate-100"
            aria-label="Edit source"
          >
            <Pencil className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
