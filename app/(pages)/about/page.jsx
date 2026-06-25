import styles from "./page.module.css";
import { aboutContent } from "./content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "About",
  description: aboutContent.description,
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <AboutProductSection />
    </main>
  );
}

function AboutProductSection() {
  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>{aboutContent.section.eyebrow}</p>
      <h1>{aboutContent.section.title}</h1>
      <p>{aboutContent.section.description}</p>
      <p className={styles.sourceNote}>{aboutContent.section.sourceNote}</p>
    </section>
  );
}
