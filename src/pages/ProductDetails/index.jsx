import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../../services/api';
import Loader from '../../components/Loader';
import { FiArrowLeft, FiEdit2, FiStar, FiShoppingBag } from 'react-icons/fi';
import styles from './styles.module.css';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getProduct(id)
      .then(res => setProduct(res.data))
      .catch(() => setError('Produto não encontrado.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader text="Carregando produto..." />;
  if (error) return <p className={styles.error}>{error}</p>;

  const categoryClass = product.category?.includes('electronics')
    ? 'badge-electronics'
    : product.category?.includes('jewelery')
    ? 'badge-jewelery'
    : product.category?.includes("men's")
    ? 'badge-men'
    : 'badge-women';

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Voltar
        </button>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/products/edit/${product.id}`)}
        >
          <FiEdit2 /> Editar Produto
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.imageSection}>
          <img src={product.image} alt={product.title} className={styles.image} />
        </div>

        <div className={styles.info}>
          <span className={`badge ${categoryClass}`}>{product.category}</span>
          <h1 className={styles.title}>{product.title}</h1>

          <div className={styles.rating}>
            <FiStar className={styles.star} />
            <strong>{product.rating?.rate}</strong>
            <span className={styles.ratingCount}>
              ({product.rating?.count} avaliações)
            </span>
          </div>

          <p className={styles.price}>R$ {(product.price * 5.7).toFixed(2)}</p>
          <p className={styles.priceUsd}>(US$ {product.price?.toFixed(2)})</p>

          <div className={styles.divider} />

          <h3 className={styles.descTitle}>
            <FiShoppingBag /> Descrição
          </h3>
          <p className={styles.description}>{product.description}</p>

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>ID do produto</span>
              <span className={styles.metaValue}>#{product.id}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Preço original</span>
              <span className={styles.metaValue}>US$ {product.price?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
