"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { SaveJobButton } from "../jobs/SaveJobButton";
import styles from "./page.module.css";
import {
  defaultSavedJobMetadata,
  priorityOptions,
  readinessOptions,
  readSavedJobsSnapshot,
  subscribeToSavedJobs,
  updateSavedJobMetadata,
} from "@/lib/jobs/savedJobsStorage";

const NOTE_LIMIT = 180;

export function SavedJobsList({ content, jobs }) {
  const savedSnapshot = useSyncExternalStore(subscribeToSavedJobs, readSavedJobsSnapshot, () => "{}");
  const savedState = useMemo(() => parseSavedJobsState(savedSnapshot), [savedSnapshot]);
  const savedIds = savedState.ids;
  const savedJobs = jobs.filter((job) => savedIds.includes(job.id));

  if (!savedIds.length) {
    return (
      <div className={styles.emptyState}>
        <h2>{content.emptyTitle}</h2>
        <p>{content.emptyDescription}</p>
        <Link className={styles.internalLink} href="/jobs">
          {content.action}
        </Link>
      </div>
    );
  }

  if (!savedJobs.length) {
    return (
      <div className={styles.emptyState}>
        <h2>{content.unavailableTitle}</h2>
        <p>{content.unavailableDescription}</p>
        <Link className={styles.internalLink} href="/jobs">
          {content.action}
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.savedList}>
      {savedJobs.map((job) => {
        const metadata = savedState.metadata[job.id] || defaultSavedJobMetadata;

        return (
          <article className={styles.jobCard} key={job.id}>
            <div className={styles.jobHeader}>
              <div>
                <p className={styles.company}>{job.company}</p>
                <h2>{job.title}</h2>
              </div>
              <span className={styles.readinessBadge}>
                {getOptionLabel(readinessOptions, metadata.readinessStatus)}
              </span>
            </div>
            <p>{job.summary}</p>
            <dl className={styles.meta}>
              <Detail label="Location" value={job.location} />
              <Detail label="Salary" value={job.salary} />
              <Detail label="Source" value={job.sourceName} />
            </dl>
            <ReadinessControls content={content} jobId={job.id} metadata={metadata} />
            <div className={styles.actions}>
              <Link className={styles.detailLink} href={`/jobs/${job.detailSlug}`}>
                {content.detailAction}
              </Link>
              <a className={styles.applyLink} href={job.sourceUrl} rel="noreferrer" target="_blank">
                {content.applyAction}
              </a>
              <SaveJobButton className={styles.saveButton} jobId={job.id} />
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function ReadinessControls({ content, jobId, metadata }) {
  const noteLength = metadata.note.length;

  return (
    <section className={styles.organizer} aria-label={`${content.organizerTitle} for saved job`}>
      <div className={styles.fieldGroup}>
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

      <fieldset className={styles.priorityGroup}>
        <legend>{content.priorityLabel}</legend>
        <div className={styles.priorityOptions}>
          {priorityOptions.map((option) => (
            <button
              aria-pressed={metadata.priority === option.value}
              key={option.value}
              onClick={() => updateSavedJobMetadata(jobId, { priority: option.value })}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className={styles.noteGroup}>
        <label htmlFor={`note-${jobId}`}>{content.noteLabel}</label>
        <textarea
          id={`note-${jobId}`}
          maxLength={NOTE_LIMIT}
          onChange={(event) => updateSavedJobMetadata(jobId, { note: event.target.value })}
          placeholder={content.notePlaceholder}
          rows={3}
          value={metadata.note}
        />
        <span>
          {noteLength}/{NOTE_LIMIT}
        </span>
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
