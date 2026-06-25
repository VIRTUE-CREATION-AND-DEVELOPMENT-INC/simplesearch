import styles from "./page.module.css";
import { healthContent } from "./content";
import { createPageMetadata } from "@/lib/seo/metadata";
import { StatusBadge } from "@/components/design-system";

export const metadata = createPageMetadata({
  title: "Status",
  description: healthContent.description,
  path: "/health",
});

export default function HealthPage() {
  return (
    <main className={styles.page}>
      <HealthStatusSection />
    </main>
  );
}

function HealthStatusSection() {
  return (
    <section className={styles.section}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{healthContent.section.eyebrow}</p>
        <h1>{healthContent.section.title}</h1>
        <p>{healthContent.section.description}</p>
      </div>

      <div className={styles.statusPanel}>
        {healthContent.section.checks.map((check) => (
          <div className={styles.check} key={check.label}>
            <span>{check.label}</span>
            <StatusBadge tone={check.tone}>{check.value}</StatusBadge>
          </div>
        ))}
        <a
          className={styles.sourceLink}
          href={healthContent.section.sourceHref}
          rel="noreferrer"
          target="_blank"
        >
          {healthContent.section.sourceLabel}
        </a>
      </div>
    </section>
  );
}
