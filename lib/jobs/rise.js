const RISE_OPEN_JOBS_URL = "https://api.joinrise.co/api/v1/jobs/openjobs";
const RISE_SOURCE_URL = "https://joinrise.co";

export async function fetchRiseJobs() {
  try {
    const response = await fetch(RISE_OPEN_JOBS_URL, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return {
        jobs: [],
        totalCount: 0,
        error: `Rise jobs request failed with status ${response.status}.`,
      };
    }

    const payload = await response.json();
    const records = Array.isArray(payload?.result?.jobs) ? payload.result.jobs : [];

    return {
      jobs: records.map(mapRiseJob).filter(Boolean),
      totalCount: numberOrZero(payload?.result?.count),
      error: null,
    };
  } catch {
    return {
      jobs: [],
      totalCount: 0,
      error: "Rise jobs are temporarily unavailable.",
    };
  }
}

export function searchJobs(jobs, query) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return jobs;
  }

  return jobs.filter((job) => job.searchText.includes(normalizedQuery));
}

function mapRiseJob(record) {
  if (!record || typeof record !== "object") {
    return null;
  }

  const owner = objectOrEmpty(record.owner);
  const description = objectOrEmpty(record.descriptionBreakdown);
  const sourceUrl = firstValidUrl(record.url, RISE_SOURCE_URL);
  const title = stringOrFallback(record.title, "Untitled role");
  const company = stringOrFallback(owner.companyName, "Company not provided");
  const location = formatLocation(record.location, record.locationAddress);
  const workModel = stringOrFallback(description.workModel, record.type, "Work model not provided");
  const salary = formatSalary(
    description.salaryRangeMinYearly,
    description.salaryRangeMaxYearly,
  );
  const skills = arrayOfStrings(description.skillRequirements).slice(0, 4);
  const keywords = arrayOfStrings(description.keywords).slice(0, 6);
  const tags = [
    record.department,
    record.seniority,
    workModel !== "Work model not provided" ? workModel : null,
    ...skills.slice(0, 2),
  ].filter(Boolean);

  const summary = stringOrFallback(
    description.oneSentenceJobSummary,
    "Rise did not provide a short summary for this role.",
  );

  const searchText = normalizeText(
    [
      title,
      company,
      location,
      workModel,
      salary,
      record.department,
      record.seniority,
      summary,
      ...skills,
      ...keywords,
    ].join(" "),
  );

  return {
    id: stringOrFallback(record._id, record.slug, sourceUrl),
    slug: stringOrFallback(record.slug, record._id, ""),
    title,
    company,
    location,
    workModel,
    seniority: stringOrFallback(record.seniority, "Seniority not provided"),
    department: stringOrFallback(record.department, "Department not provided"),
    salary,
    summary,
    skills,
    tags,
    sourceUrl,
    sourceName: "Rise / Joinrise",
    postedAt: formatDate(record.createdAt),
    searchText,
  };
}

function objectOrEmpty(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function stringOrFallback(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function arrayOfStrings(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim());
}

function numberOrZero(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function formatLocation(location, locationAddress) {
  if (typeof locationAddress === "string" && locationAddress.trim()) {
    return locationAddress.trim();
  }

  if (typeof location === "string" && location.trim()) {
    return location.trim();
  }

  const locationObject = objectOrEmpty(location);
  return stringOrFallback(locationObject.address, locationObject.city, "Location not provided");
}

function formatSalary(min, max) {
  const minimum = Number(min);
  const maximum = Number(max);

  if (Number.isFinite(minimum) && Number.isFinite(maximum) && minimum > 0 && maximum > 0) {
    return `${formatCurrency(minimum)}-${formatCurrency(maximum)}`;
  }

  if (Number.isFinite(minimum) && minimum > 0) {
    return `From ${formatCurrency(minimum)}`;
  }

  if (Number.isFinite(maximum) && maximum > 0) {
    return `Up to ${formatCurrency(maximum)}`;
  }

  return "Salary not provided";
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Post date not provided";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function firstValidUrl(...values) {
  for (const value of values) {
    if (typeof value !== "string" || !value.trim()) {
      continue;
    }

    try {
      return new URL(value).toString();
    } catch {
      continue;
    }
  }

  return RISE_SOURCE_URL;
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}
