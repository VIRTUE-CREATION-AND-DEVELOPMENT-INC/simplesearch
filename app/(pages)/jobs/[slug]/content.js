export const jobDetailContent = {
  title: "Selected job detail.",
  description:
    "A detail route for one selected Rise-sourced job with clear optional-field handling and apply-source attribution.",
  section: {
    eyebrow: "Job detail",
    title: "Selected job details will stay source-faithful.",
    description:
      "Use this route only when a detail page adds scan value beyond the result card. Raw job description HTML is intentionally not rendered until sanitization is defined.",
    emptyTitle: "No job record loaded",
    emptyDescription:
      "When the API client is connected, this area should show mapped Rise fields, optional salary handling, and the original apply link.",
    details: [
      { label: "Company", value: "Provided by Rise owner data" },
      { label: "Location", value: "Use locationAddress or location.address" },
      { label: "Apply link", value: "Preserve the job url field when present" },
    ],
    sourceLabel: "Source attribution: Rise / Joinrise",
  },
};
