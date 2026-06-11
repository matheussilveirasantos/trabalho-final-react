import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../../services/api';
import Loader from '../../components/Loader';
import { FiSearch, FiUserPlus, FiEdit2, FiTrash2, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import styles from './styles.module.css';

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getUsers()
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Deseja excluir este usuário?')) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch {
      alert('Erro ao excluir usuário.');
    }
  }

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.name?.firstname?.toLowerCase().includes(q) ||
      u.name?.lastname?.toLowerCase().includes(q)
    );
  });

  if (loading) return <Loader text="Carregando usuários..." />;

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <h2 className={styles.pageTitle}>Usuários</h2>
          <p className={styles.pageSubtitle}>{users.length} usuário{users.length !== 1 ? 's' : ''} cadastrado{users.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/users/register')}>
          <FiUserPlus /> Novo Usuário
        </button>
      </div>

      <div className={styles.searchWrap}>
        <FiSearch className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Buscar por nome, usuário ou e-mail..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <p className={styles.resultCount}>{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</p>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <FiUser size={40} />
          <p>Nenhum usuário encontrado.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map(user => (
            <div key={user.id} className={styles.card}>
              <div className={styles.avatar}>
                {(user.name?.firstname?.[0] ?? '?').toUpperCase()}
                {(user.name?.lastname?.[0] ?? '').toUpperCase()}
              </div>

              <div className={styles.info}>
                <p className={styles.name}>
                  {user.name?.firstname} {user.name?.lastname}
                </p>
                <p className={styles.username}>@{user.username}</p>

                <div className={styles.contactRow}>
                  <span className={styles.contact}><FiMail /> {user.email}</span>
                  <span className={styles.contact}><FiPhone /> {user.phone}</span>
                </div>

                <p className={styles.address}>
                  {user.address?.street}, {user.address?.number} — {user.address?.city}, {user.address?.zipcode}
                </p>
              </div>

              <div className={styles.cardActions}>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/users/${user.id}`)}
                  title="Editar"
                >
                  <FiEdit2 /> Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(user.id)}
                  title="Excluir"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
