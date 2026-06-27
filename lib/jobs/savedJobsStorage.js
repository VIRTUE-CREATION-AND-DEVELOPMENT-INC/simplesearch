const SAVED_JOBS_KEY = "simple-search:saved-jobs";
const SAVED_JOBS_METADATA_KEY = "simple-search:saved-job-readiness";
const SAVED_JOBS_EVENT = "simple-search:saved-jobs-change";
const NOTE_LIMIT = 180;

export const readinessOptions = [
  { value: "review", label: "Needs review" },
  { value: "ready", label: "Ready to apply" },
  { value: "applied", label: "Applied" },
];

export const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
];

export const defaultSavedJobMetadata = {
  readinessStatus: "review",
  priority: "normal",
  note: "",
};

const readinessValues = new Set(readinessOptions.map((option) => option.value));
const priorityValues = new Set(priorityOptions.map((option) => option.value));

export function subscribeToSavedJobs(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener(SAVED_JOBS_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SAVED_JOBS_EVENT, callback);
  };
}

export function readSavedJobsSnapshot() {
  if (typeof window === "undefined") {
    return "{}";
  }

  const state = readSavedJobsState();
  return JSON.stringify(state);
}

export function readSavedJobIds() {
  return readSavedJobsState().ids;
}

export function isJobSaved(jobId) {
  return readSavedJobIds().includes(jobId);
}

export function toggleSavedJob(jobId) {
  if (typeof window === "undefined") {
    return;
  }

  const state = readSavedJobsState();
  const saved = state.ids.includes(jobId);
  const ids = saved ? state.ids.filter((id) => id !== jobId) : [...state.ids, jobId];

  writeSavedJobsState({
    ids,
    metadata: {
      ...state.metadata,
      [jobId]: state.metadata[jobId] || defaultSavedJobMetadata,
    },
  });
}

export function updateSavedJobMetadata(jobId, patch) {
  if (typeof window === "undefined") {
    return;
  }

  const state = readSavedJobsState();

  writeSavedJobsState({
    ids: state.ids,
    metadata: {
      ...state.metadata,
      [jobId]: normalizeMetadata({
        ...(state.metadata[jobId] || defaultSavedJobMetadata),
        ...patch,
      }),
    },
  });
}

export function dispatchSavedJobsChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SAVED_JOBS_EVENT));
  }
}

function readSavedJobsState() {
  if (typeof window === "undefined") {
    return { ids: [], metadata: {} };
  }

  const savedRaw = window.localStorage.getItem(SAVED_JOBS_KEY);
  const metadataRaw = window.localStorage.getItem(SAVED_JOBS_METADATA_KEY);
  const normalized = normalizeSavedJobsState(savedRaw, metadataRaw);

  if (normalized.changed) {
    writeSavedJobsState(normalized, { notify: false });
  }

  return {
    ids: normalized.ids,
    metadata: normalized.metadata,
  };
}

function writeSavedJobsState({ ids, metadata }, { notify = true } = {}) {
  const cleanIds = uniqueStrings(ids);
  const cleanMetadata = normalizeMetadataMap(metadata, cleanIds);

  window.localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(cleanIds));
  window.localStorage.setItem(SAVED_JOBS_METADATA_KEY, JSON.stringify(cleanMetadata));

  if (notify) {
    dispatchSavedJobsChange();
  }
}

function normalizeSavedJobsState(savedRaw, metadataRaw) {
  const savedParsed = parseJson(savedRaw, []);
  const metadataParsed = parseJson(metadataRaw, {});
  const legacyMetadata = {};
  let changed = false;
  let ids = [];

  if (Array.isArray(savedParsed)) {
    ids = savedParsed.flatMap((item) => {
      if (typeof item === "string" && item.trim()) {
        return [item.trim()];
      }

      if (item && typeof item === "object") {
        const id = getLegacyId(item);

        if (id) {
          legacyMetadata[id] = normalizeMetadata(item);
          changed = true;
          return [id];
        }
      }

      changed = true;
      return [];
    });
  } else {
    changed = true;
  }

  const cleanIds = uniqueStrings(ids);
  const metadata = normalizeMetadataMap({ ...legacyMetadata, ...metadataParsed }, cleanIds);

  if (cleanIds.length !== ids.length || JSON.stringify(metadataParsed || {}) !== JSON.stringify(metadata)) {
    changed = true;
  }

  return {
    changed,
    ids: cleanIds,
    metadata,
  };
}

function normalizeMetadataMap(metadata, ids) {
  const source = metadata && typeof metadata === "object" && !Array.isArray(metadata) ? metadata : {};

  return Object.fromEntries(
    ids.map((id) => [id, normalizeMetadata(source[id] || defaultSavedJobMetadata)]),
  );
}

function normalizeMetadata(value) {
  const source = value && typeof value === "object" ? value : {};
  const readinessStatus = normalizeReadinessStatus(source.readinessStatus || source.followUpState || source.status);
  const priority = normalizePriority(source.priority);
  const note = normalizeNote(source.note || source.notes);

  return {
    readinessStatus,
    priority,
    note,
  };
}

function normalizeReadinessStatus(value) {
  if (readinessValues.has(value)) {
    return value;
  }

  if (value === "follow-up" || value === "followUp" || value === "interested") {
    return "ready";
  }

  if (value === "archived" || value === "dismissed") {
    return "review";
  }

  return defaultSavedJobMetadata.readinessStatus;
}

function normalizePriority(value) {
  return priorityValues.has(value) ? value : defaultSavedJobMetadata.priority;
}

function normalizeNote(value) {
  return typeof value === "string" ? value.slice(0, NOTE_LIMIT) : "";
}

function uniqueStrings(values) {
  return Array.from(
    new Set(values.filter((value) => typeof value === "string" && value.trim()).map((value) => value.trim())),
  );
}

function getLegacyId(item) {
  const value = item.id || item.jobId || item.savedJobId;
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function parseJson(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}
