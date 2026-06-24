import { siteConfig } from "@/lib/config/site";

const routes = [
  "/",
  "/about",
  "/contact"
];

export default function sitemap() {
  return routes.map((route) => ({
    url: siteConfig.url + route,
    lastModified: new Date(),
  }));
}
