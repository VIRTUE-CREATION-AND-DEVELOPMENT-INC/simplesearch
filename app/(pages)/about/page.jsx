import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "About",
  description: "About page placeholder for the website template.",
  path: "/about",
});

export default function AboutPage() {
  return <main>This is the about page</main>;
}
