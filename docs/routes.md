# Route Responsibilities

Simple Search is a Next.js App Router project. Public routes live under `app/(pages)/`.

## Current Routes

`/`

- Current home route.
- Planned responsibility: primary job discovery experience.
- Should own the search input, filter entry points, default results state, loading/error/empty states, job cards, source attribution, and links to job/application URLs.
- Route-local content should remain in `app/(pages)/(home)/content.js` when meaningful public copy changes.
- Page-specific styling should remain in `app/(pages)/(home)/page.module.css` when route-specific UI changes.

`/about`

- Current public about route.
- Planned responsibility: explain what Simple Search is, who it is for, and the data source.
- Should not become a product tour or marketing landing page unless a future Trial explicitly changes the product direction.
- If this route receives meaningful static copy, add a route-local `content.js` unless the neighboring route pattern changes.

`/contact`

- Current public contact route.
- Planned responsibility: lightweight project/contact information if needed.
- Should not collect sensitive user data without a documented backend and privacy decision.
- If this route receives meaningful static copy, add a route-local `content.js` unless the neighboring route pattern changes.

`/jobs`

- Job search and results template.
- Planned responsibility: show API-backed Rise / Joinrise results for default browsing and submitted searches.
- Must include empty, error, and loading behavior once the API client is wired.
- Must preserve visible Rise / Joinrise attribution and job-level apply/source links.
- Route-local content lives in `app/(pages)/jobs/content.js`.

`/jobs/[slug]`

- Selected job detail template.
- Planned responsibility: show mapped job details only when the view adds scan value beyond a result card.
- Must not render raw job description HTML until sanitization and content handling are documented.
- Must preserve source attribution and original apply/source links.
- Route-local content lives in `app/(pages)/jobs/[slug]/content.js`.

`/saved`

- Saved jobs empty-state template.
- Planned responsibility: local-only or documented storage-backed saved jobs if a future Trial approves the feature.
- Must not imply accounts or server persistence before a storage decision exists.
- Route-local content lives in `app/(pages)/saved/content.js`.

`/health`

- API readiness and source attribution status template.
- Planned responsibility: show whether the jobs API client, mapping layer, attribution, and source-link requirements are ready.
- Should remain operational and source-focused rather than a broad marketing/status page.
- Route-local content lives in `app/(pages)/health/content.js`.

## Planned Routes

`/employers`, `/post-job`, `/dashboard`

- Out of scope.
- Simple Search is not an employer workflow or job posting platform.

## Routing Rules

- Use `next/link` for internal page navigation.
- Use raw `<a>` only for external URLs, source/apply links, downloads, `mailto:`, `tel:`, same-page anchors, or intentional non-page endpoints.
- Use the shared metadata helper from `lib/seo/metadata.js` for public page metadata.
- Preserve App Router conventions and route groups already present in the repository.
- Do not add new public routes without updating this file and the workflow roadmap.
