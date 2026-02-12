"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { Upload } from "lucide-react";

const ACCEPTED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
]);

export default function CandidateDialog({
  open,
  onOpenChange,
  initialValue,
  familyGroups,
  relatedCandidates,
  onSave
}) {
  const defaults = useMemo(
    () => ({
      id: initialValue?.id || null,
      name: initialValue?.name || "",
      familyGroup: initialValue?.familyGroup || "",
      relatedCandidate: initialValue?.relatedCandidate || "",
      // keep your existing fields for the list card
      positionsRan: initialValue?.positionsRan || "Mayor (2019-2022), Congressman (2025)",
      relatedCandidatesText: initialValue?.relatedCandidates || "Chan, Cindi",
      imageUrl: initialValue?.imageUrl || "" // existing stored image url (if any)
    }),
    [initialValue]
  );

  const [form, setForm] = useState(defaults);
  const [isDragging, setIsDragging] = useState(false);

  // Holds the actual picked file (for upload later)
  const [file, setFile] = useState(null);

  // Holds an object URL used for preview
  const [previewUrl, setPreviewUrl] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    setForm(defaults);
    setFile(null);

    // reset preview when dialog opens/changes candidate
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
  }, [defaults]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setField(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  function acceptFile(f) {
    if (!f) return;

    if (!ACCEPTED_MIME.has(f.type)) {
      // you can swap this to a toast later
      alert("Please upload an image file (JPG, PNG, WEBP, GIF).");
      return;
    }

    setFile(f);

    // create preview URL
    const url = URL.createObjectURL(f);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  }

  function onFileChange(e) {
    const f = e.target.files?.[0];
    acceptFile(f);
  }

  // Drag + drop handlers
  function onDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }
  function onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }
  function onDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }
  function onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const f = e.dataTransfer.files?.[0];
    acceptFile(f);
  }

  function submit() {
    // You now have both:
    // - file (the uploaded file object)
    // - previewUrl (for UI)
    // When wiring backend, send `file` in FormData.
    onSave({
      id: form.id,
      name: form.name,
      familyGroup: form.familyGroup,
      relatedCandidate: form.relatedCandidate,
      positionsRan: form.positionsRan,
      relatedCandidates: form.relatedCandidatesText,
      // for list display right now:
      imageUrl: previewUrl || form.imageUrl,
      // for actual upload later:
      file
    });
  }

  const shownImage = previewUrl || form.imageUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
       className="
        max-w-[650px]
        p-0
        duration-200

        data-[state=open]:animate-in
        data-[state=closed]:animate-out
        data-[state=open]:fade-in-0
        data-[state=closed]:fade-out-0
        data-[state=open]:slide-in-from-bottom-5
        data-[state=closed]:slide-out-to-bottom-5
      "

      >
        <div className="rounded-xl bg-slate-50 p-10">
          {/* Avatar preview (shows uploaded picture if present) */}
          <div className="flex flex-col items-center">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-slate-200">
              {shownImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={shownImage}
                  alt="Candidate preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Upload className="h-12 w-12 text-slate-600" />
                </div>
              )}
            </div>

            {/* Dropzone */}
            <div
              className={[
                "mt-6 w-full max-w-[520px] rounded-lg border border-dashed bg-white p-6 text-center",
                "transition-colors",
                isDragging ? "border-emerald-500 bg-emerald-50" : "border-slate-300"
              ].join(" ")}
              onClick={openFilePicker}
              onDragEnter={onDragEnter}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") openFilePicker();
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-slate-600" />
                <div className="text-sm text-slate-700">
                  Drag & Drop or{" "}
                  <span className="text-blue-600 underline underline-offset-2">
                    Choose file
                  </span>{" "}
                  to upload
                </div>
                <div className="text-xs text-slate-500">JPG, PNG, WEBP, GIF</div>

                {file ? (
                  <div className="pt-2 text-xs text-slate-700">
                    Selected: <span className="font-medium">{file.name}</span>{" "}
                    <span className="text-slate-500">
                      ({Math.round(file.size / 1024)} KB)
                    </span>
                  </div>
                ) : null}
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
            </div>
          </div>

          {/* Form */}
          <div className="mt-10 space-y-6">
            <div className="space-y-2">
              <Label>Candidate Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Cindi, Chan"
              />
            </div>

            <div className="space-y-2">
              <Label>Family Group</Label>
              <Select
                value={form.familyGroup}
                onValueChange={(v) => setField("familyGroup", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Cindi, Chan" />
                </SelectTrigger>
                <SelectContent>
                  {familyGroups.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Related Candidates</Label>
              <Select
                value={form.relatedCandidate}
                onValueChange={(v) => setField("relatedCandidate", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Cindi, Chan" />
                </SelectTrigger>
                <SelectContent>
                  {relatedCandidates.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center gap-6 pt-2">
              <Button
                onClick={submit}
                className="w-[180px] bg-emerald-600 hover:bg-emerald-700"
              >
                Save
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                className="w-[180px] bg-[#E76F51] hover:bg-[#D9684C]"
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
