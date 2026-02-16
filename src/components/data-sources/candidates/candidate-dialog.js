// src/components/data-sources/candidate-dialog.js
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
import { createCandidates, updateCandidate } from "@/services/candidates-service";

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
  relatedCandidates, // unused for now
  onRefresh
}) {
  const defaults = useMemo(
    () => ({
      id: initialValue?.id || null,
      name: initialValue?.name || "",
      family_group:
        initialValue?.family_group ??
        initialValue?.familyGroup ??
        "",
      profile:
        initialValue?.profile ??
        initialValue?.imageUrl ??
        ""
    }),
    [initialValue]
  );

  const [form, setForm] = useState(defaults);
  const [nameError, setNameError] = useState("");

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const inputRef = useRef(null);

  // reset on open (fix stale values)
  useEffect(() => {
    if (!open) return;

    setForm(defaults);
    setNameError("");

    setFile(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
  }, [open, defaults]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function setField(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
    if (k === "name") setNameError("");
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  function acceptFile(f) {
    if (!f) return;

    if (!ACCEPTED_MIME.has(f.type)) {
      alert("Please upload an image file (JPG, PNG, WEBP, GIF).");
      return;
    }

    setFile(f);

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

  async function submit() {
    if (!form.name.trim()) {
      setNameError("Candidate name is required.");
      return;
    }

    try {
      setSubmitting(true);

      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("family_group", (form.family_group || "").toLowerCase());

      // only send profile if user picked a new file
      if (file instanceof File) {
        fd.append("profile", file, file.name);
      }

      // ✅ EDIT vs CREATE
      if (form.id) {
        await updateCandidate(form.id, fd);
      } else {
        await createCandidates(fd);
      }

      await onRefresh();
      onOpenChange(false);
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  }

  const shownImage = previewUrl || form.profile;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[650px] p-0">
        <div className="rounded-xl bg-slate-50 p-10">
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
                  <Upload className="h-10 w-10 text-slate-600" />
                </div>
              )}
            </div>

            <div
              className={[
                "mt-6 w-full max-w-[520px] rounded-lg border border-dashed bg-white p-6 text-center",
                "transition-colors",
                isDragging
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-300"
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

          <div className="mt-10 space-y-6">
            <div className="space-y-2">
              <Label>Candidate Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                required
              />
              {nameError ? (
                <div className="text-xs text-red-600">{nameError}</div>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>Family Group</Label>
              <Select
                value={form.family_group}
                onValueChange={(v) => setField("family_group", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select family group" />
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

            <div className="flex justify-center gap-6 pt-2">
              <Button
                onClick={submit}
                disabled={submitting}
                className="w-[180px] bg-[#2A9D8F] hover:bg-[#1B7C70] disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Save"}
              </Button>

              <Button
                onClick={() => onOpenChange(false)}
                disabled={submitting}
                className="w-[180px] bg-[#E76F51] hover:bg-[#D9684C] disabled:opacity-60"
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
