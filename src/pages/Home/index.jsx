import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProducts, getCategories } from '../../services/api';
import { FiShoppingBag, FiTag, FiTrendingUp, FiPlusCircle, FiUsers } from 'react-icons/fi';
import Loader from '../../components/Loader';
import styles from './styles.module.css';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, categories: 0, avgPrice: 0, topRated: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([getProducts(), getCategories()]);
        const products = prodRes.data;
        const avgPrice = products.reduce((acc, p) => acc + p.price, 0) / products.length;
        const topRated = products.reduce((a, b) => (a.rating?.rate > b.rating?.rate ? a : b), products[0]);
        setStats({
          total: products.length,
          categories: catRes.data.length,
          avgPrice,
          topRated,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <Loader text="Carregando dashboard..." />;

  const cards = [
    { icon: <FiShoppingBag />, label: 'Total de Produtos', value: stats.total, color: '#6c63ff' },
    { icon: <FiTag />, label: 'Categorias', value: stats.categories, color: '#f5a623' },
    { icon: <FiTrendingUp />, label: 'Preço Médio (R$)', value: `R$ ${(stats.avgPrice * 5.7).toFixed(2)}`, color: '#22c55e' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.welcome}>
        <h2 className={styles.greeting}>Olá, {user?.username}! 👋</h2>
        <p className={styles.sub}>Aqui está um resumo da sua loja hoje.</p>
      </div>

      <div className={styles.statsGrid}>
        {cards.map(({ icon, label, value, color }) => (
          <div className={styles.statCard} key={label}>
            <div className={styles.statIcon} style={{ background: `${color}22`, color }}>
              {icon}
            </div>
            <div>
              <p className={styles.statLabel}>{label}</p>
              <p className={styles.statValue}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {stats.topRated && (
        <div className={styles.featuredSection}>
          <h3 className={styles.sectionTitle}>⭐ Produto Mais Bem Avaliado</h3>
          <div className={styles.featuredCard} onClick={() => navigate(`/products/${stats.topRated.id}`)}>
            <img src={stats.topRated.image} alt={stats.topRated.title} className={styles.featuredImg} />
            <div className={styles.featuredInfo}>
              <span className={styles.featuredCategory}>{stats.topRated.category}</span>
              <h4 className={styles.featuredTitle}>{stats.topRated.title}</h4>
              <p className={styles.featuredPrice}>R$ {(stats.topRated.price * 5.7).toFixed(2)}</p>
              <p className={styles.featuredRating}>⭐ {stats.topRated.rating?.rate} ({stats.topRated.rating?.count} avaliações)</p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.quickActions}>
        <h3 className={styles.sectionTitle}>Ações Rápidas</h3>
        <div className={styles.actionsRow}>
          <button className="btn btn-primary" onClick={() => navigate('/products/add')}>
            <FiPlusCircle /> Adicionar Produto
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/products')}>
            <FiShoppingBag /> Ver Todos Produtos
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/users')}>
            <FiUsers /> Ver Usuários
          </button>
        </div>
      </div>
    </div>
  );
}