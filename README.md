# Simple Search

Simple Search is a simple job discovery app powered by the Rise / Joinrise public jobs API. It exists to help job seekers quickly search, scan, and open relevant job opportunities without turning the product into a full applicant tracking system, recruiter CRM, or job board administration tool.

The canonical project documentation lives in `docs/`:

- `docs/product.md` defines the product purpose, audience, feature set, out-of-scope items, and decision rules.
- `docs/api.md` documents the Rise / Joinrise public jobs API, response fields the app plans to use, and required source attribution.
- `docs/routes.md` defines current and planned route responsibilities for the Next.js App Router app.
- `docs/workflow-roadmap.md` defines the expected implementation stages and validation expectations for future Trials, Quests, and Odysseys.
- `docs/trials/trial-update-simple-search-project-documentation.md` is the active Trial draft for this documentation update.

## Source And Attribution

Job data comes from Rise / Joinrise. Any UI that displays Rise-sourced jobs must visibly attribute the source and preserve a link back to Rise or the original job/application URL. See `docs/api.md` before implementing search, job cards, job detail pages, or apply links.

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Validation

Run linting:

```bash
npm run lint
```

Run a production build:

```bash
npm run build
```

Before completing a documentation or implementation Trial, also confirm that no secrets, private API keys, or stale placeholder project names were added.
