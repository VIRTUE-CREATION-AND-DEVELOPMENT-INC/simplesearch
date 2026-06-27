export const jobDetailContent = {
  title: "Selected job detail.",
  description:
    "A detail route for one selected Rise-sourced job with clear optional-field handling and apply-source attribution.",
  section: {
    eyebrow: "Job detail",
    title: "Review the mapped role details.",
    description:
      "Structured fields from Rise / Joinrise are shown as provided, with missing optional fields labeled instead of inferred.",
    unavailableTitle: "Job details are temporarily unavailable",
    unavailableDescription:
      "The Rise public jobs endpoint did not return details for this request. Try the jobs list again shortly.",
    emptyTitle: "Job not found",
    emptyDescription:
      "This job was not present in the current Rise open jobs response.",
    summaryTitle: "Summary",
    roleDetailsTitle: "Role details",
    skillsTitle: "Skills",
    companyTitle: "Company",
    benefitsTitle: "Benefits",
    valuesTitle: "Values",
    keywordsTitle: "Keywords",
    applyAction: "Apply through Rise source",
    backAction: "Back to jobs",
    sourceLabel: "Source attribution: Rise / Joinrise",
    organizer: {
      organizerLabel: "Saved job organization controls",
      title: "Saved job organizer",
      description:
        "Keep local priority, follow-up state, and notes separate from the Rise job record.",
      savedLabel: "Saved locally",
      updatedLabel: "Local metadata saved",
      priorityLabel: "Priority",
      followUpLabel: "Follow-up",
      notesLabel: "Private notes",
      notesPlaceholder: "Add interview prep, questions, or application timing...",
      unsavedTitle: "Save this job to organize it",
      unsavedDescription:
        "Use the save button to add browser-only priority, follow-up, and notes for this role.",
      parseErrorTitle: "Saved data could not be read",
      parseErrorDescription:
        "The saved jobs storage value is not valid JSON. Existing browser data has not been overwritten.",
    },
  },
};
