import styles from "./styles.module.css";
// Componente de botão genérico para uso com propries
export default function Button({ children, onClick, variant = "default", ...props }) {
  return (
    <button className={`${styles.btn} ${styles[variant]}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
}