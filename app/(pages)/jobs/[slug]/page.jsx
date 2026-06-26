import Link from "next/link";
import styles from "./page.module.css";
import { jobDetailContent } from "./content";
import { createPageMetadata } from "@/lib/seo/metadata";
import { StatusBadge } from "@/components/design-system";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  return createPageMetadata({
    title: "Job Detail",
    description: jobDetailContent.description,
    path: `/jobs/${slug}`,
  });
}

export default function JobDetailPage() {
  return (
    <main className={styles.page}>
      <JobDetailSection />
    </main>
  );
}

function JobDetailSection() {
  return (
    <section className={styles.section}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{jobDetailContent.section.eyebrow}</p>
        <h1>{jobDetailContent.section.title}</h1>
        <p>{jobDetailContent.section.description}</p>
      </div>

      <article className={styles.panel}>
        <StatusBadge tone="neutral">Awaiting data</StatusBadge>
        <h2>{jobDetailContent.section.emptyTitle}</h2>
        <p>{jobDetailContent.section.emptyDescription}</p>
        <dl>
          {jobDetailContent.section.details.map((detail) => (
            <div key={detail.label}>
              <dt>{detail.label}</dt>
              <dd>{detail.value}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.source}>{jobDetailContent.section.sourceLabel}</p>
        <Link className={styles.internalLink} href="/jobs">
          Back to jobs
        </Link>
      </article>
    </section>
  );
}
