import styles from "./Field.module.css";

export function Field({
  label,
  hint,
  status,
  as = "input",
  className = "",
  ...props
}) {
  const Control = as;

  return (
    <label className={`${styles.field} ${status ? styles[status] : ""} ${className}`}>
      <span className={styles.label}>{label}</span>
      <Control className={styles.control} {...props} />
      {hint ? <span className={styles.hint}>{hint}</span> : null}
    </label>
  );
}
