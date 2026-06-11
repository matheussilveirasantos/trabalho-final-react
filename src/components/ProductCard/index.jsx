import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiStar } from 'react-icons/fi';
import styles from './styles.module.css';

export default function ProductCard({ product, onDelete }) {
  const navigate = useNavigate();

  const categoryClass = product.category?.includes('electronics')
    ? 'badge-electronics'
    : product.category?.includes('jewelery')
    ? 'badge-jewelery'
    : product.category?.includes("men's")
    ? 'badge-men'
    : 'badge-women';

  return (
    <div className={styles.card}>
      <div
        className={styles.imageWrap}
        onClick={() => navigate(`/products/${product.id}`)}
      >
        <img src={product.image} alt={product.title} className={styles.image} />
      </div>

      <div className={styles.body}>
        <span className={`badge ${categoryClass}`}>{product.category}</span>
        <h3
          className={styles.title}
          onClick={() => navigate(`/products/${product.id}`)}
        >
          {product.title}
        </h3>

        <div className={styles.meta}>
          <span className={styles.price}>
            R$ {(product.price * 5.7).toFixed(2)}
          </span>
          <span className={styles.rating}>
            <FiStar className={styles.star} />
            {product.rating?.rate} ({product.rating?.count})
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={`btn btn-secondary ${styles.actionBtn}`}
          onClick={() => navigate(`/products/edit/${product.id}`)}
        >
          <FiEdit2 /> Editar
        </button>
        <button
          className={`btn btn-danger ${styles.actionBtn}`}
          onClick={() => onDelete(product.id)}
        >
          <FiTrash2 /> Excluir
        </button>
      </div>
    </div>
  );
}
