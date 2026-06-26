export const jobsContent = {
  title: "Search Rise-backed job results.",
  description:
    "Search or browse API-backed jobs from Rise / Joinrise with source attribution and original apply links.",
  section: {
    eyebrow: "Jobs",
    title: "Search current roles from Rise / Joinrise.",
    description:
      "Browse recent roles or search by title, company, department, seniority, work model, location, and skills. Optional fields stay explicit when the source does not provide them.",
    sourceLabel: "Jobs sourced from Rise / Joinrise",
    sourceHref: "https://joinrise.co",
    queryLabel: "Search jobs",
    queryPlaceholder: "Try engineering, remote, sales, Toronto...",
    primaryAction: "Search jobs",
    clearAction: "Clear search",
    resultsLabel: "Showing {shown} of {total} API-backed jobs",
    searchedResultsLabel: "Showing {shown} matching jobs for \"{query}\"",
    browseNote:
      "Default browsing uses the Rise openjobs endpoint. Search filters the mapped response without inventing missing fields.",
    emptyTitle: "No matching jobs found",
    emptyDescription:
      "Try a broader title, company, department, seniority, work model, location, or skill. Rise attribution and source links remain visible whenever results render.",
    errorTitle: "Jobs are temporarily unavailable",
    errorDescription:
      "The page shell is ready, but the Rise public jobs endpoint did not return results. Try again shortly.",
    fields: [
      "Title, company, and location",
      "Department, seniority, and work model",
      "Salary only when the source provides it",
      "Original apply or Rise source link",
    ],
  },
};
