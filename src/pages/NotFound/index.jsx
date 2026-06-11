import { useNavigate } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';
import styles from './styles.module.css';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <div className={styles.icon}><FiAlertTriangle /></div>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>Página não encontrada</p>
      <p className={styles.sub}>O endereço que você acessou não existe ou foi removido.</p>
      <button className="btn btn-primary" onClick={() => navigate('/')}>
        <FiHome /> Voltar ao início
      </button>
    </div>
  );
}
