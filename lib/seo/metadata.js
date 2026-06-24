import { siteConfig } from "@/lib/config/site";

export function createPageMetadata({ title, description, path = "/" } = {}) {
  const pageTitle = title || siteConfig.name;
  const pageDescription = description || siteConfig.description;
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${siteConfig.url}${canonicalPath}`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: siteConfig.name,
      type: "website",
    },
  };
}
