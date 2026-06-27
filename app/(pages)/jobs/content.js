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
    fallbackResultsLabel:
      "Showing {shown} fallback matches for \"{query}\" from paginated Rise openjobs",
    browseNote:
      "Default browsing uses recent Rise openjobs. Search uses the Rise jobs/elastic endpoint, with paginated openjobs as a fallback.",
    emptyTitle: "No matching jobs found",
    emptyDescription:
      "Try a broader title, company, department, seniority, work model, location, or skill. Rise attribution and source links remain visible whenever results render.",
    searchUnavailableTitle: "Rise search is temporarily unavailable",
    searchUnavailableDescription:
      "The Rise search endpoint did not return accessible results for this query. Try again shortly or browse recent Rise open jobs.",
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
