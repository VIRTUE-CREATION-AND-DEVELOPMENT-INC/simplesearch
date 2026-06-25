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

## Planned Routes

`/jobs/[slug]`

- Optional future job detail route.
- Should be added only if the detail view improves scan quality beyond job cards.
- Must preserve Rise attribution and job-level apply/source links.
- Must not render raw HTML descriptions until sanitization and content handling are implemented.

`/saved`

- Out of scope for the current product direction.
- Do not add without a documented user-account or local-only saved-jobs decision.

`/employers`, `/post-job`, `/dashboard`

- Out of scope.
- Simple Search is not an employer workflow or job posting platform.

## Routing Rules

- Use `next/link` for internal page navigation.
- Use raw `<a>` only for external URLs, source/apply links, downloads, `mailto:`, `tel:`, same-page anchors, or intentional non-page endpoints.
- Use the shared metadata helper from `lib/seo/metadata.js` for public page metadata.
- Preserve App Router conventions and route groups already present in the repository.
- Do not add new public routes without updating this file and the workflow roadmap.
