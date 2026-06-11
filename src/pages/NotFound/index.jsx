import { useNavigate } from 'react-router-dom';
import { FiHome} from 'react-icons/fi';
import { FaGhost } from "react-icons/fa";
import styles from './styles.module.css';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <div className={styles.iconArea}>
      <FaGhost size={80} className={styles.bounceIcon} />
      </div>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>Ops... a página não foi encontrada</p>
         <button className="btn btn-primary" onClick={() => navigate('/')}>
        <FiHome /> Voltar ao catalogo de produtos
      </button>
    </div>
  );
}
