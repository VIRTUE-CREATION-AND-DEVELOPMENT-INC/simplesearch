"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { SaveJobButton } from "../jobs/SaveJobButton";
import styles from "./page.module.css";

const STORAGE_KEY = "simple-search:saved-jobs";
const STORAGE_EVENT = "simple-search:saved-jobs-change";

export function SavedJobsList({ content, jobs }) {
  const savedSnapshot = useSyncExternalStore(subscribeToSavedJobs, readSavedJobsSnapshot, () => "[]");
  const savedIds = useMemo(() => parseSavedJobs(savedSnapshot), [savedSnapshot]);
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
      {savedJobs.map((job) => (
        <article className={styles.jobCard} key={job.id}>
          <div>
            <p className={styles.company}>{job.company}</p>
            <h2>{job.title}</h2>
          </div>
          <p>{job.summary}</p>
          <dl className={styles.meta}>
            <Detail label="Location" value={job.location} />
            <Detail label="Salary" value={job.salary} />
            <Detail label="Source" value={job.sourceName} />
          </dl>
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
      ))}
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

function subscribeToSavedJobs(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener(STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}

function readSavedJobsSnapshot() {
  if (typeof window === "undefined") {
    return "[]";
  }

  return window.localStorage.getItem(STORAGE_KEY) || "[]";
}

function parseSavedJobs(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}
