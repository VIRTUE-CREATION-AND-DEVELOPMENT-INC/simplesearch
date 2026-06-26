# Workflow Roadmap

This roadmap defines the expected order of future implementation work. Future Trials, Quests, and Odysseys should use it with `docs/product.md`, `docs/api.md`, and `docs/routes.md`.

## Stage 0: Canonical Documentation

Status: complete.

Goals:

- Replace scaffold documentation with Simple Search product truth.
- Document Rise / Joinrise API usage and attribution requirements.
- Document route responsibilities and validation expectations.
- Avoid runtime behavior changes.

Validation:

```bash
npm run lint
npm run build
```

Documentation checks:

- Docs contain no stale placeholder project names.
- Docs add no secrets or private API keys.

## Stage 1: Home Page Product Shell

Status: complete.

Goals:

- Replace placeholder public route copy with Simple Search-specific route content.
- Keep static copy in `app/(pages)/(home)/content.js`.
- Use route-local `content.js` for meaningful public page copy.
- Use the shared metadata helper.
- Preserve route-local CSS module styling.
- Add visible Rise / Joinrise attribution in the public UI before showing sourced jobs.
- Provide one-section starting templates for `/`, `/jobs`, `/jobs/[slug]`, `/saved`, `/about`, `/contact`, and `/health`.

Validation:

```bash
npm run lint
npm run build
```

## Stage 2: API Client And Data Mapping

Goals:

- Add a small API client for `https://api.joinrise.co/api/v1/jobs/openjobs`.
- Map Rise records to a Simple Search job view model.
- Treat all response fields as optional.
- Add loading, error, and empty-state contracts.
- Avoid adding secrets.

Validation:

```bash
npm run lint
npm run build
```

Additional validation:

- Confirm fetch failures do not break the page shell.
- Confirm attribution remains visible when results render.

## Stage 3: Search And Filtering

Goals:

- Add text search and practical filters supported by observed response fields.
- Verify whether `jobs/elastic` should replace or supplement `openjobs`.
- Document any query parameters before using them broadly.
- Keep filtering behavior understandable and reversible.

Validation:

```bash
npm run lint
npm run build
```

Additional validation:

- Empty queries show default jobs or a clear empty state.
- No-results searches are handled without hiding attribution.

## Stage 4: Job Detail Decision

Goals:

- Decide whether the `/jobs/[slug]` template should become a live detail route.
- Define sanitization for any full HTML job descriptions before rendering them.
- Preserve apply/source links and Rise attribution.

Validation:

```bash
npm run lint
npm run build
```

Additional validation:

- Detail pages handle missing records and missing optional fields.
- Raw description rendering is safe or explicitly avoided.

## Stage 5: Polish And Operational Readiness

Status: current Trial focus.

Goals:

- Improve responsive states, accessibility, metadata, sitemap/robots behavior, and performance.
- Add tests only where behavior has meaningful risk.
- Keep the app focused on simple discovery.

Validation:

```bash
npm run lint
npm run build
```

Additional validation:

- Keyboard navigation reaches search, filters, job cards, attribution, and apply links.
- Source links are external and clearly labeled.
- No private data, API keys, or large API payloads are committed.
