import styles from "./page.module.css";
import { homeContent } from "./content";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Home",
  description: homeContent.description,
  path: "/",
});

export default function HomePage() {
  return (
    <main className={styles.page}>
      <h1>{homeContent.title}</h1>
    </main>
  );
}
