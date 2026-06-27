"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  readSavedJobsSnapshot,
  subscribeToSavedJobs,
  toggleSavedJob,
} from "@/lib/jobs/savedJobsStorage";

export function SaveJobButton({ jobId, className = "" }) {
  const savedSnapshot = useSyncExternalStore(subscribeToSavedJobs, readSavedJobsSnapshot, () => "{}");
  const saved = useMemo(() => readSavedJobIds(savedSnapshot).includes(jobId), [jobId, savedSnapshot]);

  function toggleSaved() {
    toggleSavedJob(jobId);
  }

  return (
    <button
      aria-pressed={saved}
      className={className}
      onClick={toggleSaved}
      type="button"
    >
      {saved ? "Saved locally" : "Save locally"}
    </button>
  );
}

function readSavedJobIds(snapshot) {
  try {
    const parsed = JSON.parse(snapshot);
    return Array.isArray(parsed?.ids) ? parsed.ids.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}
