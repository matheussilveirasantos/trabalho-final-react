import { NavLink } from 'react-router-dom';
import { FiShoppingBag, FiPlusCircle,  FiX } from 'react-icons/fi';
import styles from './styles.module.css';

const links = [
  { to: '/products', icon: <FiShoppingBag />, label: 'Produtos' },
  { to: '/products/add', icon: <FiPlusCircle />, label: 'Adicionar Produto' },
 
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <span className={styles.brand}>🛒 Loja 34</span>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX />
          </button>
        </div>
        <nav className={styles.nav}>
          <p className={styles.navGroup}>Menu</p>
          {links.slice(0, 3).map(({ to, icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
              onClick={onClose}
            >
              <span className={styles.linkIcon}>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
       
         
        </nav>
      </aside>
    </>
  );
}
