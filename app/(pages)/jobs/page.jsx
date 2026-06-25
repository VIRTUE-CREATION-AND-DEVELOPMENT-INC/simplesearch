import Link from "next/link";
import styles from "./page.module.css";
import { jobsContent } from "./content";
import { createPageMetadata } from "@/lib/seo/metadata";
import { StatusBadge } from "@/components/design-system";

export const metadata = createPageMetadata({
  title: "Jobs",
  description: jobsContent.description,
  path: "/jobs",
});

export default function JobsPage() {
  return (
    <main className={styles.page}>
      <JobsResultsSection />
    </main>
  );
}

function JobsResultsSection() {
  return (
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
        <StatusBadge tone="neutral">Empty</StatusBadge>
        <h2>{jobsContent.section.emptyTitle}</h2>
        <p>{jobsContent.section.emptyDescription}</p>
        <ul>
          {jobsContent.section.fields.map((field) => (
            <li key={field}>{field}</li>
          ))}
        </ul>
        <Link className={styles.internalLink} href="/">
          Start a new search
        </Link>
        <Link className={styles.internalLink} href="/jobs/example-job">
          {jobsContent.section.detailAction}
        </Link>
      </div>
    </section>
  );
}
