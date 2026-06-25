export const healthContent = {
  title: "API readiness and source status.",
  description:
    "A status template for Simple Search API readiness, Rise / Joinrise attribution, and known unwired states.",
  section: {
    eyebrow: "Status",
    title: "API readiness should be visible before live results ship.",
    description:
      "This route gives operators and future agents a compact place to confirm whether the Rise jobs API, mapping layer, and attribution surface are ready.",
    checks: [
      { label: "Jobs API client", value: "Not wired", tone: "warning" },
      { label: "Rise attribution", value: "Required", tone: "info" },
      { label: "Apply/source links", value: "Preserve job url", tone: "success" },
    ],
    sourceHref: "https://joinrise.co",
    sourceLabel: "Rise / Joinrise source",
  },
};
