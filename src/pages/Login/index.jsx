import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { loginUser } from '../../services/api';
import { FiUser, FiLock, FiMoon, FiSun, FiAlertCircle } from 'react-icons/fi';
import styles from './styles.module.css';

const schema = yup.object({
  username: yup.string().required('Usuário obrigatório').min(2, 'Mínimo 2 caracteres'),
  password: yup.string().required('Senha obrigatória').min(4, 'Mínimo 4 caracteres'),
});

export default function Login() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data) {
    setLoading(true);
    setApiError('');
    try {
      const res = await loginUser(data);
      login({ username: data.username, token: res.data.token });
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch {
      setApiError('Usuário ou senha incorretos. Tente: mor_2314 / 83r5^_');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <button className={styles.themeToggle} onClick={toggleTheme} title="Alternar tema">
        {theme === 'light' ? <FiMoon /> : <FiSun />}
      </button>

      <div className={styles.card}>
        <div className={styles.top}>
          <span className={styles.logoIcon}>🛍️</span>
          <h1 className={styles.title}>Loja 34</h1>
          <p className={styles.subtitle}>Entre na sua conta para continuar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
          {apiError && (
            <div className={styles.apiError}>
              <FiAlertCircle /> {apiError}
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Usuário</label>
            <div className={styles.inputWrap}>
              <FiUser className={styles.inputIcon} />
              <input
                {...register('username')}
                className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
                placeholder="Digite seu usuário: mor_2314"
                autoComplete="username"
              />
            </div>
            {errors.username && (
              <span className={styles.error}>{errors.username.message}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Senha</label>
            <div className={styles.inputWrap}>
              <FiLock className={styles.inputIcon} />
              <input
                {...register('password')}
                type="password"
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                placeholder="Digite sua senha: 83r5^_"
                autoComplete="current-password"
              />
            </div>
            {errors.password && (
              <span className={styles.error}>{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className={styles.hint}>
          <strong>Dica:</strong> usuário <code>mor_2314</code> / senha <code>83r5^_</code>
        </p>

       
      </div>
    </div>
  );
}
