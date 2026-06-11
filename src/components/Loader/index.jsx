import styles from './styles.module.css';

export default function Loader({ text = 'Carregando...' }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
}
