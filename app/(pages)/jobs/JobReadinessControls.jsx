"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  defaultSavedJobMetadata,
  readinessOptions,
  readSavedJobsSnapshot,
  subscribeToSavedJobs,
  updateSavedJobMetadata,
} from "@/lib/jobs/savedJobsStorage";

export function JobReadinessControls({ content, jobId, styles }) {
  const savedSnapshot = useSyncExternalStore(subscribeToSavedJobs, readSavedJobsSnapshot, () => "{}");
  const savedState = useMemo(() => parseSavedJobsState(savedSnapshot), [savedSnapshot]);

  if (!savedState.ids.includes(jobId)) {
    return null;
  }

  const metadata = savedState.metadata[jobId] || defaultSavedJobMetadata;

  return (
    <section className={styles.readinessPanel} aria-label={content.readinessTitle}>
      <span className={styles.readinessBadge}>
        {getOptionLabel(readinessOptions, metadata.readinessStatus)}
      </span>
      <div className={styles.readinessField}>
        <label htmlFor={`readiness-${jobId}`}>{content.readinessLabel}</label>
        <select
          id={`readiness-${jobId}`}
          onChange={(event) =>
            updateSavedJobMetadata(jobId, { readinessStatus: event.target.value })
          }
          value={metadata.readinessStatus}
        >
          {readinessOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

function parseSavedJobsState(value) {
  try {
    const parsed = JSON.parse(value);
    return {
      ids: Array.isArray(parsed?.ids) ? parsed.ids.filter((item) => typeof item === "string") : [],
      metadata:
        parsed?.metadata && typeof parsed.metadata === "object" && !Array.isArray(parsed.metadata)
          ? parsed.metadata
          : {},
    };
  } catch {
    return {
      ids: [],
      metadata: {},
    };
  }
}

function getOptionLabel(options, value) {
  return options.find((option) => option.value === value)?.label || value;
}
