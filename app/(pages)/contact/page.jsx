import styles from "./page.module.css";
import { contactContent } from "./content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Contact",
  description: contactContent.description,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <ContactSection />
    </main>
  );
}

function ContactSection() {
  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>{contactContent.section.eyebrow}</p>
      <h1>{contactContent.section.title}</h1>
      <p>{contactContent.section.description}</p>
      <p className={styles.note}>{contactContent.section.note}</p>
    </section>
  );
}
