import styles from "./Section.module.css";

export function Section({ eyebrow, title, description, children, className = "" }) {
  return (
    <section className={`${styles.section} ${className}`}>
      <div className={styles.header}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
