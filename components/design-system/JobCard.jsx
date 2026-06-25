import { Button } from "./Button";
import { StatusBadge } from "./StatusBadge";
import styles from "./JobCard.module.css";

export function JobCard({ job, selected = false }) {
  return (
    <article className={`${styles.card} ${selected ? styles.selected : ""}`}>
      <div className={styles.header}>
        <div>
          <p className={styles.company}>{job.company}</p>
          <h3>{job.title}</h3>
        </div>
        <StatusBadge tone={job.statusTone}>{job.status}</StatusBadge>
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
          <dt>Match</dt>
          <dd>{job.match}</dd>
        </div>
      </dl>

      <div className={styles.tags}>
        {job.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className={styles.actions}>
        <Button variant={selected ? "primary" : "ghost"} size="sm">
          {selected ? "Selected" : "View details"}
        </Button>
        <Button variant={job.saved ? "secondary" : "ghost"} size="sm">
          {job.saved ? "Saved" : "Save"}
        </Button>
      </div>
    </article>
  );
}
