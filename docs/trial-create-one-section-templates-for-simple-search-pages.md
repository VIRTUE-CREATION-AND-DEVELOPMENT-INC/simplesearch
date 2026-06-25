# Trial Draft: One-Section Route Templates

## Scope

Create focused one-section starting points for the core Simple Search routes:

- `/`
- `/jobs`
- `/jobs/[slug]`
- `/saved`
- `/about`
- `/contact`
- `/health`

## Product Constraints

- Use Rise / Joinrise as the planned jobs source.
- Keep source attribution visible anywhere job data is represented.
- Do not invent missing salary, company, location, or description fields.
- Do not imply accounts or server-backed saved jobs before a storage decision exists.

## Validation

```bash
npm run lint
npm run build
```
