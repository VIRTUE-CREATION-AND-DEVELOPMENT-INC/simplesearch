# Trial: Fix Simple Search Job Search Reliability

## Purpose

Fix submitted job searches so they are not limited to the first small Rise `openjobs` response page.

## Scope

- Verify usable Rise search and pagination paths.
- Prefer the documented Rise `jobs/elastic?search=` endpoint for submitted `/jobs?q=` searches.
- Keep browse mode backed by recent Rise `openjobs` results.
- Use broader paginated `openjobs` matching as a fallback when Rise search is unavailable.
- Preserve Rise / Joinrise attribution and original source/apply links wherever jobs render.

## Acceptance

- `/jobs?q=remote`, `/jobs?q=developer`, `/jobs?q=designer`, `/jobs?q=product`, `/jobs?q=data`, and `/jobs?q=sales` return meaningful Rise-backed results when accessible Rise data contains matches.
- Browse mode without a query still shows recent/default Rise jobs.
- Search result cards continue to show title, company, location, work model, salary when available, skills or keywords when available, and source/apply links.
- Empty states distinguish no matching results from Rise API/search unavailable.
- Rise / Joinrise attribution remains visible on jobs list, job detail, and saved jobs surfaces.

## Validation

- `npm run lint`
- `npm run build`
