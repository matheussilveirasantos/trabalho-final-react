import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiMoon, FiSun, FiLogOut, FiMenu } from 'react-icons/fi';
import styles from './styles.module.css';

export default function Header({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <button className={styles.menuBtn} onClick={onToggleSidebar} title="Menu">
        <FiMenu />
      </button>

      <span className={styles.brand}>🛒 ShopAdmin</span>

      <div className={styles.actions}>
        <button className={styles.iconBtn} onClick={toggleTheme} title="Alternar tema">
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>

        <div className={styles.userInfo}>
          <div className={styles.avatar}>{user?.username?.[0]?.toUpperCase()}</div>
          <span className={styles.username}>{user?.username}</span>
        </div>

        <button className={styles.iconBtn} onClick={logout} title="Sair">
          <FiLogOut />
        </button>
      </div>
    </header>
  );
}
