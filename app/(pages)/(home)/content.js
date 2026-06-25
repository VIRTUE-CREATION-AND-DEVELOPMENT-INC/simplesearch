export const homeContent = {
  title: "Find roles worth opening.",
  description:
    "Simple Search gives job seekers a quiet, readable workspace for scanning relevant roles, filtering by intent, and keeping useful details close.",
  hero: {
    eyebrow: "Job discovery baseline",
    title: "Find roles worth opening.",
    description:
      "Search across curated job results, compare the details that matter, and keep saved opportunities visible without visual noise.",
    metrics: [
      { label: "Readable result cards", value: "3" },
      { label: "Core UI states", value: "6" },
      { label: "Filter groups", value: "4" },
    ],
  },
  search: {
    title: "Search setup",
    description:
      "Inputs are intentionally compact and direct: role, location, work mode, and timing.",
    primaryAction: "Search roles",
    secondaryAction: "Clear",
    fields: {
      query: "Product designer, frontend engineer, analyst",
      location: "Remote, Toronto, New York",
      mode: ["Remote", "Hybrid", "On-site"],
    },
  },
  filters: {
    eyebrow: "Filters",
    title: "Narrow the list without losing context",
    description:
      "Filter chips use selected and count states so people can scan what is active before opening a result.",
    groups: [
      { label: "Best match", count: 18, selected: true },
      { label: "Saved", count: 4, selected: false },
      { label: "Remote", count: 11, selected: true },
      { label: "Posted this week", count: 9, selected: false },
      { label: "Salary visible", count: 13, selected: false },
      { label: "Senior level", count: 7, selected: false },
    ],
  },
  jobs: {
    eyebrow: "Results",
    title: "Job cards prioritize decision details",
    description:
      "Each card exposes company, status, location, salary, match quality, tags, selected state, and saved state.",
    list: [
      {
        company: "Northstar Labs",
        title: "Senior Product Designer",
        summary:
          "Own search and onboarding improvements for a B2B workflow product with a small design systems team.",
        location: "Remote US / Canada",
        salary: "$148k-$176k",
        match: "94%",
        status: "Actively hiring",
        statusTone: "success",
        saved: true,
        tags: ["Design systems", "B2B SaaS", "Research"],
      },
      {
        company: "Clearpath Health",
        title: "Frontend Engineer, Search",
        summary:
          "Build fast result views, accessible filtering patterns, and detail pages for clinical operations teams.",
        location: "Hybrid Toronto",
        salary: "$132k-$158k",
        match: "88%",
        status: "New today",
        statusTone: "info",
        saved: false,
        tags: ["Next.js", "Accessibility", "Data UI"],
      },
      {
        company: "Harbor Finance",
        title: "Product Analyst",
        summary:
          "Translate search and application behavior into clear dashboards for marketplace growth teams.",
        location: "Remote",
        salary: "$112k-$136k",
        match: "81%",
        status: "Closing soon",
        statusTone: "warning",
        saved: false,
        tags: ["SQL", "Funnels", "Experimentation"],
      },
    ],
  },
  details: {
    eyebrow: "Detail layout",
    title: "Details stay useful beside the list",
    description:
      "The selected result pattern reserves space for responsibilities, fit signals, and application readiness without sending people away from the result set.",
    highlights: [
      "Selected job state is visible on the card and detail panel.",
      "Saved state is quiet, persistent, and distinct from selection.",
      "Status treatments cover new, active, closing, error, and neutral states.",
    ],
  },
  states: {
    eyebrow: "System states",
    title: "Quiet feedback for search changes",
    description:
      "Loading, empty, and error states use the same card language as results so the interface does not jump between modes.",
    list: [
      {
        kind: "loading",
        tone: "info",
        label: "Loading",
        title: "Refreshing matches",
        description: "Use subtle motion and stable dimensions while new results load.",
      },
      {
        kind: "empty",
        tone: "neutral",
        label: "Empty",
        title: "No roles yet",
        description: "Offer a clear reset path and suggest broader filters.",
      },
      {
        kind: "error",
        tone: "danger",
        label: "Error",
        title: "Search unavailable",
        description: "Keep the query visible and explain that retrying is safe.",
      },
    ],
  },
};
