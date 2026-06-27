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
const SORT_RECENT = "recent";

const SORT_OPTIONS = [
  { value: SORT_RECENT, contentKey: "sortRecent" },
  { value: "saved", contentKey: "sortSaved" },
  { value: "priority", contentKey: "sortPriority" },
  { value: "follow-up", contentKey: "sortFollowUp" },
  { value: "company", contentKey: "sortCompany" },
];

const PRIORITY_RANK = {
  high: 0,
  normal: 1,
  low: 2,
};

const FOLLOW_UP_RANK = {
  "follow-up": 0,
  "not-started": 1,
  applied: 2,
  closed: 3,
};

export function SavedJobsList({ content, jobs }) {
  const savedSnapshot = useSyncExternalStore(subscribeToSavedJobs, readSavedJobsSnapshot, () => "[]");
  const savedState = useMemo(() => parseSavedJobsSnapshot(savedSnapshot), [savedSnapshot]);
  const [priorityFilter, setPriorityFilter] = useState(ALL_PRIORITIES);
  const [stateFilter, setStateFilter] = useState(ALL_STATES);
  const [sortBy, setSortBy] = useState(SORT_RECENT);
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
  const sortedRecords = sortSavedRecords(filteredRecords, sortBy);

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
          onSortChange={setSortBy}
          onStateChange={setStateFilter}
          priorityFilter={priorityFilter}
          savedCount={savedRecords.length}
          shownCount={0}
          sortBy={sortBy}
          stateFilter={stateFilter}
          unavailableCount={unavailableRecords.length}
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
        onSortChange={setSortBy}
        onStateChange={setStateFilter}
        priorityFilter={priorityFilter}
        savedCount={savedRecords.length}
        shownCount={filteredRecords.length}
        sortBy={sortBy}
        stateFilter={stateFilter}
        unavailableCount={unavailableRecords.length}
      />

      {sortedRecords.length ? (
        <div className={styles.savedList}>
          {sortedRecords.map(({ job, record }) => (
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
    setSortBy(SORT_RECENT);
  }
}

function SavedToolbar({
  content,
  onPriorityChange,
  onReset,
  onSortChange,
  onStateChange,
  priorityFilter,
  savedCount,
  shownCount,
  sortBy,
  stateFilter,
  unavailableCount,
}) {
  const hasFilters =
    priorityFilter !== ALL_PRIORITIES || stateFilter !== ALL_STATES || sortBy !== SORT_RECENT;

  return (
    <div className={styles.toolbar}>
      <div>
        <h2>{content.filterTitle}</h2>
        <p>{content.filterDescription}</p>
        <dl className={styles.summaryStats} aria-label="Saved jobs summary">
          <div>
            <dt>{content.savedCountLabel}</dt>
            <dd>{savedCount}</dd>
          </div>
          <div>
            <dt>{content.visibleCountLabel}</dt>
            <dd>{shownCount}</dd>
          </div>
          <div>
            <dt>{content.unavailableCountLabel}</dt>
            <dd>{unavailableCount}</dd>
          </div>
        </dl>
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
        <label className={styles.selectField}>
          <span>{content.sortLabel}</span>
          <select value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {content[option.contentKey]}
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
        <Detail label={content.savedDateLabel} value={formatSavedDate(record.createdAt)} />
        <Detail label={content.editedDateLabel} value={formatSavedDate(record.updatedAt)} />
        <Detail
          label={content.followUpLabel}
          value={getOptionLabel(FOLLOW_UP_OPTIONS, record.metadata.followUpState)}
        />
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

function sortSavedRecords(records, sortBy) {
  return [...records].sort((left, right) => {
    if (sortBy === "saved") {
      return compareDates(right.record.createdAt, left.record.createdAt);
    }

    if (sortBy === "priority") {
      return compareRank(
        PRIORITY_RANK[left.record.metadata.priority],
        PRIORITY_RANK[right.record.metadata.priority],
      ) || compareDates(right.record.updatedAt, left.record.updatedAt);
    }

    if (sortBy === "follow-up") {
      return compareRank(
        FOLLOW_UP_RANK[left.record.metadata.followUpState],
        FOLLOW_UP_RANK[right.record.metadata.followUpState],
      ) || compareDates(right.record.updatedAt, left.record.updatedAt);
    }

    if (sortBy === "company") {
      return (
        left.job.company.localeCompare(right.job.company) ||
        left.job.title.localeCompare(right.job.title)
      );
    }

    return compareDates(right.record.updatedAt, left.record.updatedAt);
  });
}

function compareRank(left, right) {
  return (left ?? Number.MAX_SAFE_INTEGER) - (right ?? Number.MAX_SAFE_INTEGER);
}

function compareDates(left, right) {
  return dateValue(left) - dateValue(right);
}

function dateValue(value) {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
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
