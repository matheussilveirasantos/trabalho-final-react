import styles from "./styles.module.css";
// Componente de botão genérico para uso com propries
export default function Button({ children, onClick, variant = "default" }) {
  return (
    <button className={`${styles.btn} ${styles[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
}
  