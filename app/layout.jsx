import "../styles/globals.css";
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import styles from "./layout.module.css";

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className={styles.header}>
          <Link className={styles.brand} href="/">
            {siteConfig.name}
          </Link>
          <nav className={styles.nav} aria-label="Primary navigation">
            <Link href="/jobs">Jobs</Link>
            <Link href="/saved">Saved</Link>
            <Link href="/about">About</Link>
            <Link href="/health">Status</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
