import styles from "./FilterPill.module.css";

export function FilterPill({ children, selected = false, count, ...props }) {
  return (
    <button
      className={`${styles.pill} ${selected ? styles.selected : ""}`}
      type="button"
      aria-pressed={selected}
      {...props}
    >
      <span>{children}</span>
      {typeof count === "number" ? <span className={styles.count}>{count}</span> : null}
    </button>
  );
}
