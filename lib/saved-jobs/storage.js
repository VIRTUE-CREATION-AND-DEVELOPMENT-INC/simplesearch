"use client";

export const SAVED_JOBS_STORAGE_KEY = "simple-search:saved-jobs";
export const SAVED_JOBS_STORAGE_EVENT = "simple-search:saved-jobs-change";

export const PRIORITY_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "low", label: "Low" },
];

export const FOLLOW_UP_OPTIONS = [
  { value: "not-started", label: "Not started" },
  { value: "follow-up", label: "Follow up" },
  { value: "applied", label: "Applied" },
  { value: "closed", label: "Closed" },
];

const STORAGE_VERSION = 1;
const EMPTY_SNAPSHOT = "[]";

const DEFAULT_METADATA = {
  notes: "",
  priority: "normal",
  followUpState: "not-started",
};

export function subscribeToSavedJobs(callback) {
  function handleStorage(event) {
    if (!event.key || event.key === SAVED_JOBS_STORAGE_KEY) {
      callback();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(SAVED_JOBS_STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(SAVED_JOBS_STORAGE_EVENT, callback);
  };
}

export function readSavedJobsSnapshot() {
  if (typeof window === "undefined") {
    return EMPTY_SNAPSHOT;
  }

  return window.localStorage.getItem(SAVED_JOBS_STORAGE_KEY) || EMPTY_SNAPSHOT;
}

export function parseSavedJobsSnapshot(snapshot) {
  try {
    return normalizeStoredValue(JSON.parse(snapshot || EMPTY_SNAPSHOT));
  } catch {
    return {
      records: [],
      parseError: true,
      needsMigration: false,
    };
  }
}

export function readSavedJobs() {
  return parseSavedJobsSnapshot(readSavedJobsSnapshot());
}

export function migrateSavedJobsStorage() {
  const state = readSavedJobs();

  if (!state.parseError && state.needsMigration) {
    writeSavedJobs(state.records);
  }

  return state;
}

export function isJobSaved(jobId) {
  return readSavedJobs().records.some((record) => record.id === jobId);
}

export function toggleSavedJob(jobId) {
  const state = readSavedJobs();
  const exists = state.records.some((record) => record.id === jobId);
  const nextRecords = exists
    ? state.records.filter((record) => record.id !== jobId)
    : [...state.records, createRecord(jobId)];

  writeSavedJobs(nextRecords);
  return !exists;
}

export function updateSavedJobMetadata(jobId, metadataPatch) {
  const state = readSavedJobs();
  const existingRecord = state.records.find((record) => record.id === jobId) || createRecord(jobId);
  const nextMetadata = normalizeMetadata({
    ...existingRecord.metadata,
    ...metadataPatch,
  });
  const nextRecord = {
    ...existingRecord,
    metadata: nextMetadata,
    updatedAt: new Date().toISOString(),
  };
  const nextRecords = state.records.some((record) => record.id === jobId)
    ? state.records.map((record) => (record.id === jobId ? nextRecord : record))
    : [...state.records, nextRecord];

  writeSavedJobs(nextRecords);
  return nextRecord;
}

function normalizeStoredValue(value) {
  if (Array.isArray(value)) {
    return {
      records: normalizeRecords(value),
      parseError: false,
      needsMigration: true,
    };
  }

  if (value && typeof value === "object" && Array.isArray(value.jobs)) {
    return {
      records: normalizeRecords(value.jobs),
      parseError: false,
      needsMigration: value.version !== STORAGE_VERSION || value.jobs.some(needsRecordMigration),
    };
  }

  return {
    records: [],
    parseError: false,
    needsMigration: value !== null,
  };
}

function normalizeRecords(items) {
  const records = [];
  const seenIds = new Set();

  for (const item of items) {
    const record = normalizeRecord(item);

    if (!record || seenIds.has(record.id)) {
      continue;
    }

    records.push(record);
    seenIds.add(record.id);
  }

  return records;
}

function normalizeRecord(item) {
  if (typeof item === "string") {
    return createRecord(item);
  }

  if (!item || typeof item !== "object" || typeof item.id !== "string") {
    return null;
  }

  const createdAt = typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString();
  const updatedAt = typeof item.updatedAt === "string" ? item.updatedAt : createdAt;

  return {
    id: item.id,
    createdAt,
    updatedAt,
    metadata: normalizeMetadata(item.metadata),
  };
}

function normalizeMetadata(metadata) {
  const source = metadata && typeof metadata === "object" ? metadata : {};
  const priority = PRIORITY_OPTIONS.some((option) => option.value === source.priority)
    ? source.priority
    : DEFAULT_METADATA.priority;
  const followUpState = FOLLOW_UP_OPTIONS.some((option) => option.value === source.followUpState)
    ? source.followUpState
    : DEFAULT_METADATA.followUpState;

  return {
    notes: typeof source.notes === "string" ? source.notes.slice(0, 1000) : DEFAULT_METADATA.notes,
    priority,
    followUpState,
  };
}

function createRecord(jobId) {
  const now = new Date().toISOString();

  return {
    id: jobId,
    createdAt: now,
    updatedAt: now,
    metadata: { ...DEFAULT_METADATA },
  };
}

function needsRecordMigration(item) {
  if (!item || typeof item !== "object") {
    return true;
  }

  const normalized = normalizeRecord(item);
  return !normalized || JSON.stringify(item) !== JSON.stringify(normalized);
}

function writeSavedJobs(records) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    SAVED_JOBS_STORAGE_KEY,
    JSON.stringify({
      version: STORAGE_VERSION,
      jobs: records,
    }),
  );
  window.dispatchEvent(new Event(SAVED_JOBS_STORAGE_EVENT));
}
