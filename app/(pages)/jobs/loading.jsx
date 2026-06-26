import styles from "./page.module.css";
import { jobsContent } from "./content";
import { StatusBadge } from "@/components/design-system";

export default function JobsLoading() {
  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{jobsContent.section.eyebrow}</p>
          <h1>{jobsContent.section.title}</h1>
          <p>{jobsContent.section.description}</p>
          <a
            className={styles.sourceLink}
            href={jobsContent.section.sourceHref}
            rel="noreferrer"
            target="_blank"
          >
            {jobsContent.section.sourceLabel}
          </a>
        </div>

        <div className={styles.emptyState}>
          <StatusBadge tone="neutral">Loading</StatusBadge>
          <h2>Loading jobs from Rise</h2>
          <p>
            Fetching API-backed roles while preserving source attribution and apply links.
          </p>
        </div>
      </section>
    </main>
  );
}
