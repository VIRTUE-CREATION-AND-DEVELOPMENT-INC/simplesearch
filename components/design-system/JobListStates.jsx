import { StatusBadge } from "./StatusBadge";
import styles from "./JobListStates.module.css";

export function JobListStates({ states }) {
  return (
    <div className={styles.grid}>
      {states.map((state) => (
        <article className={`${styles.state} ${styles[state.kind]}`} key={state.kind}>
          <StatusBadge tone={state.tone}>{state.label}</StatusBadge>
          <h3>{state.title}</h3>
          <p>{state.description}</p>
        </article>
      ))}
    </div>
  );
}
