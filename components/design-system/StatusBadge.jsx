import styles from "./StatusBadge.module.css";

export function StatusBadge({ tone = "neutral", children }) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}
