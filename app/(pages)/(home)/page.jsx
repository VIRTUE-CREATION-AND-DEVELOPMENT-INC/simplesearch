import Link from "next/link";
import styles from "./page.module.css";
import { homeContent } from "./content";
import { createPageMetadata } from "@/lib/seo/metadata";
import { Field } from "@/components/design-system";

export const metadata = createPageMetadata({
  title: "Home",
  description: homeContent.description,
  path: "/",
});

export default function HomePage() {
  return (
    <main className={styles.page}>
      <HomeSearchSection />
    </main>
  );
}

function HomeSearchSection() {
  return (
    <section className={styles.searchSection}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{homeContent.hero.eyebrow}</p>
        <h1>{homeContent.hero.title}</h1>
        <p className={styles.description}>{homeContent.hero.description}</p>
      </div>

      <form className={styles.searchBox} action="/jobs">
        <Field
          label={homeContent.hero.queryLabel}
          name="q"
          placeholder={homeContent.hero.queryPlaceholder}
        />
        <div className={styles.actions}>
          <button className={styles.primaryAction} type="submit">
            {homeContent.hero.primaryAction}
          </button>
          <Link className={styles.secondaryAction} href="/jobs">
            {homeContent.hero.secondaryAction}
          </Link>
        </div>
        <p className={styles.sourceNote}>{homeContent.hero.sourceNote}</p>
      </form>
    </section>
  );
}
