import Link from "next/link";
import styles from "./page.module.css";
import { jobsContent } from "./content";
import { SaveJobButton } from "./SaveJobButton";
import { createPageMetadata } from "@/lib/seo/metadata";
import { Field, StatusBadge } from "@/components/design-system";
import { fetchRiseJobs } from "@/lib/jobs/rise";

export const metadata = createPageMetadata({
  title: "Jobs",
  description: jobsContent.description,
  path: "/jobs",
});

export default async function JobsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const query = normalizeQuery(resolvedSearchParams?.q);
  const riseResult = await fetchRiseJobs({ query });

  return (
    <main className={styles.page}>
      <JobsResultsSection
        error={riseResult.error}
        jobs={riseResult.jobs}
        query={query}
        searchUnavailable={riseResult.searchUnavailable}
        totalCount={riseResult.totalCount || riseResult.jobs.length}
        warning={riseResult.warning}
      />
    </main>
  );
}

function JobsResultsSection({ error, jobs, query, searchUnavailable, totalCount, warning }) {
  const hasJobs = jobs.length > 0;

  return (
    <section className={styles.section}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{jobsContent.section.eyebrow}</p>
        <h1>{jobsContent.section.title}</h1>
        <p>{jobsContent.section.description}</p>
        <SourceAttribution />
      </div>

      <form className={styles.searchPanel} action="/jobs">
        <Field
          defaultValue={query}
          label={jobsContent.section.queryLabel}
          name="q"
          placeholder={jobsContent.section.queryPlaceholder}
          type="search"
        />
        <div className={styles.searchActions}>
          <button className={styles.primaryAction} type="submit">
            {jobsContent.section.primaryAction}
          </button>
          {query ? (
            <Link className={styles.secondaryAction} href="/jobs">
              {jobsContent.section.clearAction}
            </Link>
          ) : null}
        </div>
        <p className={styles.browseNote}>{jobsContent.section.browseNote}</p>
      </form>

      <div className={styles.resultsHeader}>
        <StatusBadge tone={error || searchUnavailable ? "warning" : "success"}>
          {getStatusLabel({ error, searchUnavailable })}
        </StatusBadge>
        <p>{getResultsLabel({ count: jobs.length, query, searchUnavailable, totalCount })}</p>
      </div>

      {warning && hasJobs ? <NoticePanel message={warning} /> : null}
      {error ? <StatePanel kind="error" /> : null}
      {!error && !hasJobs ? (
        <StatePanel kind={searchUnavailable ? "searchUnavailable" : "empty"} />
      ) : null}

      {hasJobs ? (
        <div className={styles.resultsGrid}>
          {jobs.map((job) => (
            <JobResultCard job={job} key={job.id} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function NoticePanel({ message }) {
  return (
    <div className={styles.noticePanel}>
      <StatusBadge tone="warning">Fallback</StatusBadge>
      <p>{message}</p>
    </div>
  );
}

function JobResultCard({ job }) {
  return (
    <article className={styles.jobCard}>
      <div className={styles.jobHeader}>
        <div>
          <p className={styles.company}>{job.company}</p>
          <h2>{job.title}</h2>
        </div>
        <StatusBadge tone="neutral">{job.workModel}</StatusBadge>
      </div>

      <p className={styles.summary}>{job.summary}</p>

      <dl className={styles.meta}>
        <div>
          <dt>Location</dt>
          <dd>{job.location}</dd>
        </div>
        <div>
          <dt>Salary</dt>
          <dd>{job.salary}</dd>
        </div>
        <div>
          <dt>Posted</dt>
          <dd>{job.postedAt}</dd>
        </div>
        <div>
          <dt>Department</dt>
          <dd>{job.department}</dd>
        </div>
        <div>
          <dt>Seniority</dt>
          <dd>{job.seniority}</dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd>{job.sourceName}</dd>
        </div>
      </dl>

      {job.tags.length ? (
        <div className={styles.tags} aria-label="Job tags">
          {job.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      ) : null}

      <div className={styles.cardActions}>
        <Link className={styles.detailLink} href={`/jobs/${job.detailSlug}`}>
          View details
        </Link>
        <a className={styles.applyLink} href={job.sourceUrl} rel="noreferrer" target="_blank">
          Apply at source
        </a>
        <SaveJobButton className={styles.saveButton} jobId={job.id} />
      </div>
    </article>
  );
}

function StatePanel({ kind }) {
  const isError = kind === "error";
  const isSearchUnavailable = kind === "searchUnavailable";

  return (
    <div className={styles.emptyState}>
      <StatusBadge tone={isError || isSearchUnavailable ? "warning" : "neutral"}>
        {isError || isSearchUnavailable ? "Unavailable" : "Empty"}
      </StatusBadge>
      <h2>
        {isError
          ? jobsContent.section.errorTitle
          : isSearchUnavailable
            ? jobsContent.section.searchUnavailableTitle
            : jobsContent.section.emptyTitle}
      </h2>
      <p>
        {isError
          ? jobsContent.section.errorDescription
          : isSearchUnavailable
            ? jobsContent.section.searchUnavailableDescription
            : jobsContent.section.emptyDescription}
      </p>
      <ul>
        {jobsContent.section.fields.map((field) => (
          <li key={field}>{field}</li>
        ))}
      </ul>
      <Link className={styles.internalLink} href="/">
        Start a new search
      </Link>
    </div>
  );
}

function SourceAttribution() {
  return (
    <a
      className={styles.sourceLink}
      href={jobsContent.section.sourceHref}
      rel="noreferrer"
      target="_blank"
    >
      {jobsContent.section.sourceLabel}
    </a>
  );
}

function getResultsLabel({ count, query, searchUnavailable, totalCount }) {
  if (query) {
    const label = searchUnavailable
      ? jobsContent.section.fallbackResultsLabel
      : jobsContent.section.searchedResultsLabel;

    return label
      .replace("{shown}", String(count))
      .replace("{query}", query);
  }

  return jobsContent.section.resultsLabel
    .replace("{shown}", String(count))
    .replace("{total}", String(totalCount));
}

function getStatusLabel({ error, searchUnavailable }) {
  if (error) {
    return "API unavailable";
  }

  if (searchUnavailable) {
    return "Search fallback";
  }

  return "API-backed";
}

function normalizeQuery(value) {
  return typeof value === "string" ? value.trim() : "";
}
