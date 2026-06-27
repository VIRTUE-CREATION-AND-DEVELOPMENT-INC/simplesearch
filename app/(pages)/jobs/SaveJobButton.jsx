"use client";

import { useSyncExternalStore } from "react";
import {
  isJobSaved,
  subscribeToSavedJobs,
  toggleSavedJob,
} from "@/lib/saved-jobs/storage";

export function SaveJobButton({ jobId, className = "" }) {
  const saved = useSyncExternalStore(
    subscribeToSavedJobs,
    () => isJobSaved(jobId),
    () => false,
  );

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
