"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "simple-search:saved-jobs";
const STORAGE_EVENT = "simple-search:saved-jobs-change";

export function SaveJobButton({ jobId, className = "" }) {
  const saved = useSyncExternalStore(
    subscribeToSavedJobs,
    () => readSavedJobs().includes(jobId),
    () => false,
  );

  function toggleSaved() {
    const savedJobs = readSavedJobs();
    const nextSaved = savedJobs.includes(jobId)
      ? savedJobs.filter((savedJobId) => savedJobId !== jobId)
      : [...savedJobs, jobId];

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSaved));
    window.dispatchEvent(new Event(STORAGE_EVENT));
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

function subscribeToSavedJobs(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener(STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}

function readSavedJobs() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}
