export const jobsContent = {
  title: "Job results prepared for Rise-backed search.",
  description:
    "A results route for API-backed jobs with source attribution, optional fields, and an empty state ready for unwired data.",
  section: {
    eyebrow: "Jobs",
    title: "Results will land here after the Rise API is connected.",
    description:
      "This route is reserved for searchable jobs from Rise / Joinrise. It keeps the source visible and avoids invented company or salary data.",
    sourceLabel: "Jobs sourced from Rise / Joinrise",
    sourceHref: "https://joinrise.co",
    emptyTitle: "No jobs loaded yet",
    emptyDescription:
      "Connect the jobs API client to show default or searched roles. Until then, keep filters broad and preserve the original apply URL on every result.",
    fields: [
      "Title, company, and location",
      "Department, seniority, and work model",
      "Salary only when the source provides it",
      "Original apply or Rise source link",
    ],
  },
};
