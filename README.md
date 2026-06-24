# Website Project Template

Skeletal Next.js App Router template for the website web-app profile.

## Included Surfaces

- `/`: This is the website home page
- `/about`: This is the about page
- `/contact`: This is the contact page

## Local Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Template Notes

- Keep this template minimal until profile-specific UI decisions are approved.
- Use `app/(pages)/` for public and profile route placeholders.
- Use `lib/config/site.js` for site-wide metadata defaults.
- Use `lib/seo/metadata.js` for page-level metadata helpers.
- Run initialize sync after project creation so `AGENTS.md`, skills, `.virtue`, and local agent ignores are applied.

## Environment

Copy `.env.example` to `.env.local` only in a real project, never in the template source.

```txt
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
