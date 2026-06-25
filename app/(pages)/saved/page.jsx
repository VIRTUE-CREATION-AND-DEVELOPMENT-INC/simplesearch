import Link from "next/link";
import styles from "./page.module.css";
import { savedContent } from "./content";
import { createPageMetadata } from "@/lib/seo/metadata";
import { StatusBadge } from "@/components/design-system";

export const metadata = createPageMetadata({
  title: "Saved Jobs",
  description: savedContent.description,
  path: "/saved",
});

export default function SavedPage() {
  return (
    <main className={styles.page}>
      <SavedJobsSection />
    </main>
  );
}

function SavedJobsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{savedContent.section.eyebrow}</p>
        <h1>{savedContent.section.title}</h1>
        <p>{savedContent.section.description}</p>
      </div>

      <div className={styles.emptyState}>
        <StatusBadge tone="neutral">Empty</StatusBadge>
        <h2>{savedContent.section.emptyTitle}</h2>
        <p>{savedContent.section.emptyDescription}</p>
        <Link className={styles.internalLink} href="/jobs">
          {savedContent.section.action}
        </Link>
      </div>
    </section>
  );
}
