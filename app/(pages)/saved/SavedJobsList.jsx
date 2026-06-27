"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { SaveJobButton } from "../jobs/SaveJobButton";
import {
  FOLLOW_UP_OPTIONS,
  PRIORITY_OPTIONS,
  migrateSavedJobsStorage,
  parseSavedJobsSnapshot,
  readSavedJobsSnapshot,
  subscribeToSavedJobs,
  toggleSavedJob,
  updateSavedJobMetadata,
} from "@/lib/saved-jobs/storage";
import { StatusBadge } from "@/components/design-system";
import styles from "./page.module.css";

const ALL_PRIORITIES = "all";
const ALL_STATES = "all";

export function SavedJobsList({ content, jobs }) {
  const savedSnapshot = useSyncExternalStore(subscribeToSavedJobs, readSavedJobsSnapshot, () => "[]");
  const savedState = useMemo(() => parseSavedJobsSnapshot(savedSnapshot), [savedSnapshot]);
  const [priorityFilter, setPriorityFilter] = useState(ALL_PRIORITIES);
  const [stateFilter, setStateFilter] = useState(ALL_STATES);
  const jobById = useMemo(() => new Map(jobs.map((job) => [job.id, job])), [jobs]);

  useEffect(() => {
    migrateSavedJobsStorage();
  }, []);

  const savedRecords = savedState.records;
  const availableRecords = savedRecords
    .map((record) => ({ record, job: jobById.get(record.id) }))
    .filter(({ job }) => Boolean(job));
  const unavailableRecords = savedRecords.filter((record) => !jobById.has(record.id));
  const filteredRecords = availableRecords.filter(({ record }) => {
    const matchesPriority =
      priorityFilter === ALL_PRIORITIES || record.metadata.priority === priorityFilter;
    const matchesState =
      stateFilter === ALL_STATES || record.metadata.followUpState === stateFilter;

    return matchesPriority && matchesState;
  });

  if (savedState.parseError) {
    return (
      <StatePanel
        action={content.action}
        description={content.parseErrorDescription}
        title={content.parseErrorTitle}
        tone="warning"
      />
    );
  }

  if (!savedRecords.length) {
    return (
      <StatePanel
        action={content.action}
        description={content.emptyDescription}
        title={content.emptyTitle}
      />
    );
  }

  if (!availableRecords.length) {
    return (
      <div className={styles.savedWorkspace}>
        <SavedToolbar
          content={content}
          onPriorityChange={setPriorityFilter}
          onReset={resetFilters}
          onStateChange={setStateFilter}
          priorityFilter={priorityFilter}
          stateFilter={stateFilter}
        />
        <UnavailablePanel content={content} records={unavailableRecords} />
      </div>
    );
  }

  return (
    <div className={styles.savedWorkspace}>
      <SavedToolbar
        content={content}
        onPriorityChange={setPriorityFilter}
        onReset={resetFilters}
        onStateChange={setStateFilter}
        priorityFilter={priorityFilter}
        stateFilter={stateFilter}
      />

      {filteredRecords.length ? (
        <div className={styles.savedList}>
          {filteredRecords.map(({ job, record }) => (
            <SavedJobCard content={content} job={job} key={record.id} record={record} />
          ))}
        </div>
      ) : (
        <StatePanel
          action={content.resetFilters}
          asButton
          description={content.noMatchesDescription}
          onAction={resetFilters}
          title={content.noMatchesTitle}
        />
      )}

      {unavailableRecords.length ? (
        <UnavailablePanel content={content} records={unavailableRecords} />
      ) : null}
    </div>
  );

  function resetFilters() {
    setPriorityFilter(ALL_PRIORITIES);
    setStateFilter(ALL_STATES);
  }
}

function SavedToolbar({
  content,
  onPriorityChange,
  onReset,
  onStateChange,
  priorityFilter,
  stateFilter,
}) {
  const hasFilters = priorityFilter !== ALL_PRIORITIES || stateFilter !== ALL_STATES;

  return (
    <div className={styles.toolbar}>
      <div>
        <h2>{content.filterTitle}</h2>
        <p>{content.filterDescription}</p>
      </div>
      <div className={styles.filterControls}>
        <label className={styles.selectField}>
          <span>{content.priorityFilterLabel}</span>
          <select value={priorityFilter} onChange={(event) => onPriorityChange(event.target.value)}>
            <option value={ALL_PRIORITIES}>{content.allPriorities}</option>
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.selectField}>
          <span>{content.stateFilterLabel}</span>
          <select value={stateFilter} onChange={(event) => onStateChange(event.target.value)}>
            <option value={ALL_STATES}>{content.allStates}</option>
            {FOLLOW_UP_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button className={styles.resetButton} disabled={!hasFilters} onClick={onReset} type="button">
          {content.resetFilters}
        </button>
      </div>
    </div>
  );
}

function SavedJobCard({ content, job, record }) {
  const [lastEdited, setLastEdited] = useState("");

  function updateMetadata(metadataPatch) {
    updateSavedJobMetadata(record.id, metadataPatch);
    setLastEdited(content.updatedLabel);
  }

  function removeSavedJob() {
    toggleSavedJob(record.id);
  }

  return (
    <article className={styles.jobCard}>
      <div className={styles.jobHeader}>
        <div>
          <p className={styles.company}>{job.company}</p>
          <h2>{job.title}</h2>
        </div>
        <StatusBadge tone={getPriorityTone(record.metadata.priority)}>
          {getOptionLabel(PRIORITY_OPTIONS, record.metadata.priority)}
        </StatusBadge>
      </div>
      <p>{job.summary}</p>
      <dl className={styles.meta}>
        <Detail label="Location" value={job.location} />
        <Detail label="Salary" value={job.salary} />
        <Detail label="Source" value={job.sourceName} />
      </dl>

      <div className={styles.organizer}>
        <label className={styles.selectField}>
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
        <label className={styles.selectField}>
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
        <label className={styles.notesField}>
          <span>{content.notesLabel}</span>
          <textarea
            maxLength={1000}
            onChange={(event) => updateMetadata({ notes: event.target.value })}
            placeholder={content.notesPlaceholder}
            rows={4}
            value={record.metadata.notes}
          />
        </label>
        <p className={styles.editStatus} aria-live="polite">
          {lastEdited || `${content.savedLocallyLabel}: ${formatSavedDate(record.updatedAt)}`}
        </p>
      </div>

      <div className={styles.actions}>
        <Link className={styles.detailLink} href={`/jobs/${job.detailSlug}`}>
          {content.detailAction}
        </Link>
        <a className={styles.applyLink} href={job.sourceUrl} rel="noreferrer" target="_blank">
          {content.applyAction}
        </a>
        <SaveJobButton className={styles.saveButton} jobId={job.id} />
        <button className={styles.removeButton} onClick={removeSavedJob} type="button">
          {content.removeAction}
        </button>
      </div>
    </article>
  );
}

function UnavailablePanel({ content, records }) {
  return (
    <section className={styles.unavailablePanel} aria-labelledby="unavailable-saved-jobs">
      <div>
        <StatusBadge tone="warning">{content.unavailableTitle}</StatusBadge>
        <h2 id="unavailable-saved-jobs">{content.unavailableCardTitle}</h2>
        <p>{content.unavailableCardDescription}</p>
      </div>
      <ul className={styles.unavailableList}>
        {records.map((record) => (
          <li key={record.id}>
            <span>{record.id}</span>
            <small>
              {getOptionLabel(PRIORITY_OPTIONS, record.metadata.priority)} /{" "}
              {getOptionLabel(FOLLOW_UP_OPTIONS, record.metadata.followUpState)}
            </small>
          </li>
        ))}
      </ul>
    </section>
  );
}

function StatePanel({ action, asButton = false, description, onAction, title, tone = "neutral" }) {
  return (
    <div className={styles.emptyState}>
      <StatusBadge tone={tone}>{tone === "warning" ? "Unavailable" : "Saved jobs"}</StatusBadge>
      <h2>{title}</h2>
      <p>{description}</p>
      {asButton ? (
        <button className={styles.internalLinkButton} onClick={onAction} type="button">
          {action}
        </button>
      ) : (
        <Link className={styles.internalLink} href="/jobs">
          {action}
        </Link>
      )}
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

function getOptionLabel(options, value) {
  return options.find((option) => option.value === value)?.label || value;
}

function getPriorityTone(priority) {
  if (priority === "high") {
    return "warning";
  }

  if (priority === "low") {
    return "info";
  }

  return "neutral";
}

function formatSavedDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "now";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
