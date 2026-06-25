# Product Truth

## What Simple Search Is

Simple Search is a lightweight job discovery app for searching and browsing current roles from the Rise / Joinrise public jobs API. The app should make job opportunities easy to find, compare, and open at the source.

Simple Search is intentionally narrow. It should favor fast search, useful filters, readable job cards, clear source attribution, and direct application links over account-heavy or employer-facing workflows.

## Who It Is For

Simple Search is for job seekers who want a direct way to discover roles across companies, departments, locations, seniority levels, and work models. The first audience is a candidate who wants to answer: "What jobs are available, and which ones are worth opening now?"

Secondary users are project operators and future agents working on this repository. These docs are the product truth they should read before making implementation decisions.

## Problem It Solves

Job search products often bury the core workflow behind sign-up prompts, unclear filters, duplicated postings, or apply paths that do not preserve the original source. Simple Search solves a narrower problem: search public job data, show the practical details needed for triage, attribute the source, and send the user to the correct application destination.

## Intended Feature Set

- Search jobs by text using the Rise / Joinrise public jobs API.
- Browse default or recent jobs when no search term is entered.
- Filter or facet by practical fields such as department, seniority, work model, location, company, and salary availability when the API response supports it.
- Show readable job cards with title, company, location, work model, seniority, salary range, short summary, key skills, and freshness.
- Link every job to the original apply URL or a Rise job URL when that is the available source URL.
- Preserve visible Rise / Joinrise attribution anywhere Rise-sourced jobs are displayed.
- Provide a job detail view only when it adds meaningful scan value beyond the card.
- Handle loading, empty, error, and partial-data states without hiding attribution or apply links.

## Out Of Scope

- User accounts, saved jobs, profile management, resumes, auto-apply flows, and application tracking.
- Employer onboarding, job posting, recruiter dashboards, and paid job promotion.
- Scraping third-party job sites directly.
- Storing secrets or private API keys for the public jobs API.
- Rewriting or enriching job descriptions with unverified claims.
- Hiding, replacing, or weakening source attribution.

## Product Decision Rules

- Prefer a smaller, faster search experience over a broad platform surface.
- Treat Rise / Joinrise as the source of truth for job records unless the app later introduces a documented persistence layer.
- Do not invent missing fields. If the API omits salary, coordinates, company logo, or summary data, the UI should degrade gracefully.
- Keep source links explicit. A user should always understand where the posting came from and where the apply action will take them.
- Future implementation Trials should consult `docs/api.md`, `docs/routes.md`, and `docs/workflow-roadmap.md` before changing public routes or job data assumptions.
