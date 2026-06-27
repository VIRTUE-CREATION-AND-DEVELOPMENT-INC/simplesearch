"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
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
const PRIORITY_WEIGHT = {
  high: 0,
  normal: 1,
  low: 2,
};
const READINESS_WEIGHT = {
  ready: 0,
  review: 1,
  applied: 2,
};

export function SavedJobsList({ content, jobs }) {
  const [readinessFilter, setReadinessFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [groupBy, setGroupBy] = useState("none");
  const savedSnapshot = useSyncExternalStore(subscribeToSavedJobs, readSavedJobsSnapshot, () => "{}");
  const savedState = useMemo(() => parseSavedJobsState(savedSnapshot), [savedSnapshot]);
  const savedIds = savedState.ids;
  const savedJobs = useMemo(
    () =>
      jobs
        .filter((job) => savedIds.includes(job.id))
        .map((job) => ({
          job,
          metadata: savedState.metadata[job.id] || defaultSavedJobMetadata,
        }))
        .sort(compareSavedJobItems),
    [jobs, savedIds, savedState.metadata],
  );
  const filteredJobs = useMemo(
    () =>
      savedJobs.filter(({ metadata }) => {
        const readinessMatches =
          readinessFilter === "all" || metadata.readinessStatus === readinessFilter;
        const priorityMatches = priorityFilter === "all" || metadata.priority === priorityFilter;

        return readinessMatches && priorityMatches;
      }),
    [priorityFilter, readinessFilter, savedJobs],
  );
  const groupedJobs = useMemo(
    () => groupSavedJobs(filteredJobs, groupBy),
    [filteredJobs, groupBy],
  );
  const summary = useMemo(() => getSavedSummary(savedJobs), [savedJobs]);

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
    <div className={styles.workspace}>
      <section className={styles.workspacePanel} aria-labelledby="saved-workspace-title">
        <div>
          <h2 id="saved-workspace-title">{content.workspaceTitle}</h2>
          <p>{content.workspaceDescription}</p>
        </div>

        <dl className={styles.summaryGrid} aria-label="Saved jobs summary">
          <SummaryItem label={content.summaryTotal} value={summary.total} />
          <SummaryItem label={content.summaryReady} value={summary.ready} />
          <SummaryItem label={content.summaryHighPriority} value={summary.highPriority} />
        </dl>

        <div className={styles.workspaceControls}>
          <FilterSelect
            id="saved-readiness-filter"
            label={content.filterReadinessLabel}
            onChange={setReadinessFilter}
            options={[{ value: "all", label: content.allReadinessOption }, ...readinessOptions]}
            value={readinessFilter}
          />
          <FilterSelect
            id="saved-priority-filter"
            label={content.filterPriorityLabel}
            onChange={setPriorityFilter}
            options={[{ value: "all", label: content.allPriorityOption }, ...priorityOptions]}
            value={priorityFilter}
          />
          <FilterSelect
            id="saved-group-by"
            label={content.groupByLabel}
            onChange={setGroupBy}
            options={[
              { value: "none", label: content.groupNoneOption },
              { value: "readiness", label: content.groupReadinessOption },
              { value: "priority", label: content.groupPriorityOption },
            ]}
            value={groupBy}
          />
        </div>
      </section>

      {filteredJobs.length ? (
        <div className={styles.groupedList}>
          {groupedJobs.map((group) => (
            <section
              className={styles.savedGroup}
              key={group.key}
              {...(groupBy !== "none" ? { "aria-labelledby": `group-${group.key}` } : {})}
            >
              {groupBy !== "none" ? (
                <div className={styles.groupHeader}>
                  <h2 id={`group-${group.key}`}>{group.label}</h2>
                  <span>{group.items.length}</span>
                </div>
              ) : null}
              <div className={styles.savedList}>
                {group.items.map(({ job, metadata }) => (
                  <SavedJobCard content={content} job={job} key={job.id} metadata={metadata} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h2>{content.filteredEmptyTitle}</h2>
          <p>{content.filteredEmptyDescription}</p>
        </div>
      )}
    </div>
  );
}

function SavedJobCard({ content, job, metadata }) {
  return (
    <article className={styles.jobCard}>
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
}

function SummaryItem({ label, value }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
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

function FilterSelect({ id, label, onChange, options, value }) {
  return (
    <div className={styles.fieldGroup}>
      <label htmlFor={id}>{label}</label>
      <select id={id} onChange={(event) => onChange(event.target.value)} value={value}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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

function getSavedSummary(items) {
  return items.reduce(
    (summary, { metadata }) => ({
      total: summary.total + 1,
      ready: summary.ready + (metadata.readinessStatus === "ready" ? 1 : 0),
      highPriority: summary.highPriority + (metadata.priority === "high" ? 1 : 0),
    }),
    { total: 0, ready: 0, highPriority: 0 },
  );
}

function groupSavedJobs(items, groupBy) {
  if (groupBy === "readiness") {
    return readinessOptions
      .map((option) => ({
        key: option.value,
        label: option.label,
        items: items.filter(({ metadata }) => metadata.readinessStatus === option.value),
      }))
      .filter((group) => group.items.length);
  }

  if (groupBy === "priority") {
    return priorityOptions
      .map((option) => ({
        key: option.value,
        label: option.label,
        items: items.filter(({ metadata }) => metadata.priority === option.value),
      }))
      .filter((group) => group.items.length);
  }

  return [{ key: "all", label: "All saved roles", items }];
}

function compareSavedJobItems(first, second) {
  const firstPriority = PRIORITY_WEIGHT[first.metadata.priority] ?? PRIORITY_WEIGHT.normal;
  const secondPriority = PRIORITY_WEIGHT[second.metadata.priority] ?? PRIORITY_WEIGHT.normal;

  if (firstPriority !== secondPriority) {
    return firstPriority - secondPriority;
  }

  const firstReadiness =
    READINESS_WEIGHT[first.metadata.readinessStatus] ?? READINESS_WEIGHT.review;
  const secondReadiness =
    READINESS_WEIGHT[second.metadata.readinessStatus] ?? READINESS_WEIGHT.review;

  if (firstReadiness !== secondReadiness) {
    return firstReadiness - secondReadiness;
  }

  return first.job.title.localeCompare(second.job.title);
}
