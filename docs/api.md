# Rise / Joinrise Public Jobs API

## Source

Simple Search uses the Rise / Joinrise public jobs API as its job data source.

Base API host:

```txt
https://api.joinrise.co
```

Primary public jobs endpoint:

```txt
GET https://api.joinrise.co/api/v1/jobs/openjobs
```

Observed search-style endpoint used by the public Rise jobs surface:

```txt
GET https://api.joinrise.co/api/v1/jobs/elastic
```

Verified search request:

```txt
GET https://api.joinrise.co/api/v1/jobs/elastic?search={query}&limit=50
```

Verified open jobs pagination:

```txt
GET https://api.joinrise.co/api/v1/jobs/openjobs?page={page}&limit=50
```

`openjobs` defaults to 20 jobs and accepts `page`. The observed maximum effective `limit` is 50. `skip` did not change the observed page. For submitted searches, Simple Search should prefer `jobs/elastic?search=` and only fall back to paginated `openjobs` plus local matching when the search endpoint is unavailable or inaccessible. Default browse mode should continue to use recent `openjobs` results.

## Attribution Requirement

Any feature that displays jobs from Rise / Joinrise must include visible source attribution. The UI must preserve a link back to Rise or to the original application URL supplied by the API.

Minimum acceptable attribution pattern:

```txt
Jobs sourced from Rise
```

The attribution should link to `https://joinrise.co` when shown globally, and each job card or detail view should preserve the job-level `url` field as the apply/source link when present. Do not present Rise-sourced jobs as first-party Simple Search postings.

## Practical Response Shape

The `openjobs` endpoint returns JSON with this high-level shape:

```json
{
  "success": true,
  "result": {
    "jobs": [],
    "count": 1918
  }
}
```

Each `result.jobs[]` item commonly includes:

- `_id`: stable job identifier from Rise.
- `title`: job title.
- `location` or `locationAddress`: job location. Some records include coordinates.
- `url`: external apply or source URL.
- `department`: role category, such as Engineering or Sales & Business Development.
- `seniority`: seniority label, such as Mid-Level or Senior Level.
- `type`: practical work model label, such as Remote, Hybrid, or Onsite.
- `owner`: company data. Depending on endpoint shape, this may be a nested object or an owner id.
- `owner.companyName`: company name when owner is expanded.
- `owner.photo`: company logo when available.
- `owner.slug`: company slug when available.
- `owner.sector`, `owner.teamSize`, `owner.funding`, `owner.badges`: optional company context.
- `descriptionBreakdown`: structured summary and metadata.
- `descriptionBreakdown.oneSentenceJobSummary`: short summary suitable for cards.
- `descriptionBreakdown.workModel`: work model when separate from `type`.
- `descriptionBreakdown.employmentType`: employment type, such as Full-time.
- `descriptionBreakdown.salaryRangeMinYearly` and `salaryRangeMaxYearly`: yearly salary range when available.
- `descriptionBreakdown.skillRequirements`: practical skill bullets.
- `descriptionBreakdown.keywords`: search/display keywords.
- `slug`: Rise job slug.
- `contentType`: usually `job`.
- `createdAt` and `updatedAt`: timestamps.
- `viewCount`, `likedBy`, `applyCount`: engagement fields that Simple Search should not depend on for core UX.
- `job`: sometimes an expanded nested array containing full description HTML and richer qualification breakdowns.

## Fields Simple Search Should Use First

Job cards:

- `_id`
- `title`
- `owner.companyName`
- `owner.photo`
- `location.address` or `locationAddress`
- `type` or `descriptionBreakdown.workModel`
- `seniority`
- `department`
- `descriptionBreakdown.oneSentenceJobSummary`
- `descriptionBreakdown.salaryRangeMinYearly`
- `descriptionBreakdown.salaryRangeMaxYearly`
- `descriptionBreakdown.skillRequirements`
- `url`
- `createdAt`

Search and filtering:

- `title`
- `department`
- `seniority`
- `type`
- `location.address` or `locationAddress`
- `owner.companyName`
- `descriptionBreakdown.keywords`
- `descriptionBreakdown.skillRequirements`

Detail view, if added:

- full `job[].description` only after sanitization and rendering decisions are documented.
- richer `descriptionBreakdown` sections when present.
- company context from `owner`.

## Implementation Notes

- The public endpoint does not require a private key for observed reads. Do not add secrets unless a future provider contract explicitly requires them.
- Treat fields as optional. The API may return different shapes between `openjobs`, `elastic`, and detail endpoints.
- Do not rely on `viewCount`, `likedBy`, or `applyCount` for ranking until product requirements define that behavior.
- Do not store full response payloads in the repository.
- If a future Trial adds API client code, it should include timeout/error handling, empty-state behavior, and a documented mapping layer from Rise fields to Simple Search view models.
