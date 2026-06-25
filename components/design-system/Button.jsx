import styles from "./Button.module.css";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
