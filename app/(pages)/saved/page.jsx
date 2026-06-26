import styles from "./page.module.css";
import { savedContent } from "./content";
import { SavedJobsList } from "./SavedJobsList";
import { createPageMetadata } from "@/lib/seo/metadata";
import { StatusBadge } from "@/components/design-system";
import { fetchRiseJobs } from "@/lib/jobs/rise";

export const metadata = createPageMetadata({
  title: "Saved Jobs",
  description: savedContent.description,
  path: "/saved",
});

export default async function SavedPage() {
  const riseResult = await fetchRiseJobs();

  return (
    <main className={styles.page}>
      <SavedJobsSection error={riseResult.error} jobs={riseResult.jobs} />
    </main>
  );
}

function SavedJobsSection({ error, jobs }) {
  return (
    <section className={styles.section}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{savedContent.section.eyebrow}</p>
        <h1>{savedContent.section.title}</h1>
        <p>{savedContent.section.description}</p>
        <a className={styles.sourceLink} href="https://joinrise.co" rel="noreferrer" target="_blank">
          Jobs sourced from Rise / Joinrise
        </a>
      </div>

      {error ? <StatusBadge tone="warning">API fallback</StatusBadge> : null}
      <SavedJobsList content={savedContent.section} jobs={jobs} />
    </section>
  );
}
