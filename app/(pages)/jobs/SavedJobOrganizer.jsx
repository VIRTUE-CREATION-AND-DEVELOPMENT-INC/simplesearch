"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  FOLLOW_UP_OPTIONS,
  PRIORITY_OPTIONS,
  parseSavedJobsSnapshot,
  readSavedJobsSnapshot,
  subscribeToSavedJobs,
  updateSavedJobMetadata,
} from "@/lib/saved-jobs/storage";
import styles from "./SavedJobOrganizer.module.css";

export function SavedJobOrganizer({ className = "", content, jobId, size = "default" }) {
  const savedSnapshot = useSyncExternalStore(subscribeToSavedJobs, readSavedJobsSnapshot, () => "[]");
  const savedState = useMemo(() => parseSavedJobsSnapshot(savedSnapshot), [savedSnapshot]);
  const record = savedState.records.find((item) => item.id === jobId);
  const [lastEdited, setLastEdited] = useState("");
  const compact = size === "compact";

  function updateMetadata(metadataPatch) {
    updateSavedJobMetadata(jobId, metadataPatch);
    setLastEdited(content.updatedLabel);
  }

  if (savedState.parseError) {
    return (
      <aside className={`${styles.organizer} ${styles.warning} ${className}`} aria-live="polite">
        <strong>{content.parseErrorTitle}</strong>
        <p>{content.parseErrorDescription}</p>
      </aside>
    );
  }

  if (!record) {
    return (
      <aside className={`${styles.organizer} ${styles.unsaved} ${className}`} aria-live="polite">
        <strong>{content.unsavedTitle}</strong>
        <p>{content.unsavedDescription}</p>
      </aside>
    );
  }

  return (
    <aside
      className={`${styles.organizer} ${compact ? styles.compact : ""} ${className}`}
      aria-label={content.organizerLabel}
    >
      <div className={styles.header}>
        <div>
          <strong>{content.title}</strong>
          <p>{content.description}</p>
        </div>
        <span aria-live="polite">{lastEdited || content.savedLabel}</span>
      </div>

      <div className={styles.controls}>
        <label className={styles.field}>
          <span>{content.priorityLabel}</span>
          <select
            value={record.metadata.priority}
            onChange={(event) => updateMetadata({ priority: event.target.value })}
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>{content.followUpLabel}</span>
          <select
            value={record.metadata.followUpState}
            onChange={(event) => updateMetadata({ followUpState: event.target.value })}
          >
            {FOLLOW_UP_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={styles.notesField}>
        <span>{content.notesLabel}</span>
        <textarea
          maxLength={1000}
          onChange={(event) => updateMetadata({ notes: event.target.value })}
          placeholder={content.notesPlaceholder}
          rows={compact ? 3 : 4}
          value={record.metadata.notes}
        />
      </label>
    </aside>
  );
}
