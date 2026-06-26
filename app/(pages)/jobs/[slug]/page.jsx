import Link from "next/link";
import styles from "./page.module.css";
import { jobDetailContent } from "./content";
import { createPageMetadata } from "@/lib/seo/metadata";
import { StatusBadge } from "@/components/design-system";
import { SaveJobButton } from "../SaveJobButton";
import { fetchRiseJobBySlug } from "@/lib/jobs/rise";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { job } = await fetchRiseJobBySlug(slug);

  return createPageMetadata({
    title: job ? `${job.title} at ${job.company}` : "Job Detail",
    description: job?.summary || jobDetailContent.description,
    path: `/jobs/${slug}`,
  });
}

export default async function JobDetailPage({ params }) {
  const { slug } = await params;
  const riseResult = await fetchRiseJobBySlug(slug);

  return (
    <main className={styles.page}>
      <JobDetailSection error={riseResult.error} job={riseResult.job} />
    </main>
  );
}

function JobDetailSection({ error, job }) {
  return (
    <section className={styles.section}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{jobDetailContent.section.eyebrow}</p>
        <h1>{job?.title || jobDetailContent.section.title}</h1>
        <p>{job?.company ? `${job.company} · ${job.location}` : jobDetailContent.section.description}</p>
        <a
          className={styles.sourceLink}
          href="https://joinrise.co"
          rel="noreferrer"
          target="_blank"
        >
          {jobDetailContent.section.sourceLabel}
        </a>
      </div>

      {error ? <StatePanel kind="error" /> : null}
      {!error && !job ? <StatePanel kind="empty" /> : null}
      {job ? <JobDetail job={job} /> : null}
    </section>
  );
}

function JobDetail({ job }) {
  const companyRows = [
    ["Company", job.company],
    ["Sector", job.companyInfo.sector],
    ["Team size", job.companyInfo.teamSize],
    ["Funding", job.companyInfo.funding],
    ["Company location", job.companyInfo.location],
  ];

  return (
    <article className={styles.panel}>
      <div className={styles.header}>
        <StatusBadge tone="success">API-backed</StatusBadge>
        <StatusBadge tone="neutral">{job.workModel}</StatusBadge>
      </div>

      <section className={styles.block}>
        <h2>{jobDetailContent.section.summaryTitle}</h2>
        <p>{job.summary}</p>
      </section>

      <section className={styles.block}>
        <h2>{jobDetailContent.section.roleDetailsTitle}</h2>
        <dl className={styles.details}>
          <Detail label="Location" value={job.location} />
          <Detail label="Salary" value={job.salary} />
          <Detail label="Employment" value={job.employmentType} />
          <Detail label="Department" value={job.department} />
          <Detail label="Seniority" value={job.seniority} />
          <Detail label="Posted" value={job.postedAt} />
        </dl>
      </section>

      <TagSection items={job.skills} title={jobDetailContent.section.skillsTitle} />

      <section className={styles.block}>
        <h2>{jobDetailContent.section.companyTitle}</h2>
        <dl className={styles.details}>
          {companyRows.map(([label, value]) => (
            <Detail key={label} label={label} value={value} />
          ))}
        </dl>
        <TagList items={job.companyInfo.badges} />
      </section>

      <TagSection items={job.companyInfo.benefits} title={jobDetailContent.section.benefitsTitle} />
      <TagSection items={job.companyInfo.values} title={jobDetailContent.section.valuesTitle} />
      <TagSection items={job.keywords} title={jobDetailContent.section.keywordsTitle} />

      <div className={styles.actions}>
        <a className={styles.applyLink} href={job.sourceUrl} rel="noreferrer" target="_blank">
          {jobDetailContent.section.applyAction}
        </a>
        <SaveJobButton className={styles.saveButton} jobId={job.id} />
        <Link className={styles.internalLink} href="/jobs">
          {jobDetailContent.section.backAction}
        </Link>
      </div>
    </article>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function TagSection({ items, title }) {
  if (!items.length) {
    return null;
  }

  return (
    <section className={styles.block}>
      <h2>{title}</h2>
      <TagList items={items} />
    </section>
  );
}

function TagList({ items }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className={styles.tags}>
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function StatePanel({ kind }) {
  const isError = kind === "error";

  return (
    <article className={styles.panel}>
      <StatusBadge tone={isError ? "warning" : "neutral"}>
        {isError ? "Unavailable" : "Not found"}
      </StatusBadge>
      <h2>
        {isError
          ? jobDetailContent.section.unavailableTitle
          : jobDetailContent.section.emptyTitle}
      </h2>
      <p>
        {isError
          ? jobDetailContent.section.unavailableDescription
          : jobDetailContent.section.emptyDescription}
      </p>
      <Link className={styles.internalLink} href="/jobs">
        {jobDetailContent.section.backAction}
      </Link>
    </article>
  );
}
