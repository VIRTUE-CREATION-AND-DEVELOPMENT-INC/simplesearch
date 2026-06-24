import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Contact",
  description: "Contact page placeholder for the website template.",
  path: "/contact",
});

export default function ContactPage() {
  return <main>This is the contact page</main>;
}
