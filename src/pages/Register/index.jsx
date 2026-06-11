import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { createUser } from '../../services/api';
import { FiUserPlus, FiMoon, FiSun, FiArrowLeft } from 'react-icons/fi';
import styles from './styles.module.css';

const schema = yup.object({
  firstname: yup.string().required('Nome obrigatório').min(2, 'Mínimo 2 caracteres'),
  lastname: yup.string().required('Sobrenome obrigatório').min(2, 'Mínimo 2 caracteres'),
  username: yup
    .string()
    .required('Usuário obrigatório')
    .min(3, 'Mínimo 3 caracteres')
    .matches(/^[a-z0-9_]+$/, 'Apenas letras minúsculas, números e _'),
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup
    .string()
    .required('Senha obrigatória')
    .min(6, 'Mínimo 6 caracteres'),
  confirmPassword: yup
    .string()
    .required('Confirme a senha')
    .oneOf([yup.ref('password')], 'As senhas não coincidem'),
  phone: yup
    .string()
    .required('Telefone obrigatório')
    .matches(/^[\d\s\-().+]+$/, 'Telefone inválido'),
  city: yup.string().required('Cidade obrigatória'),
  street: yup.string().required('Rua obrigatória'),
  number: yup
    .number()
    .typeError('Número inválido')
    .positive('Deve ser positivo')
    .integer('Deve ser inteiro')
    .required('Número obrigatório'),
  zipcode: yup.string().required('CEP obrigatório'),
});

export default function Register() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  async function onSubmit(data) {
    setLoading(true);
    setApiError('');
    setSuccess('');
    try {
      const payload = {
        email: data.email,
        username: data.username,
        password: data.password,
        name: { firstname: data.firstname, lastname: data.lastname },
        address: {
          city: data.city,
          street: data.street,
          number: Number(data.number),
          zipcode: data.zipcode,
          geolocation: { lat: '0', long: '0' },
        },
        phone: data.phone,
      };
      const res = await createUser(payload);
      setSuccess(`Conta criada com sucesso! (ID: ${res.data.id}) Redirecionando para o login...`);
      reset();
      setTimeout(() => navigate('/login'), 2500);
    } catch {
      setApiError('Erro ao criar conta. Tente novamente.');
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
          <span className={styles.logoIcon}>🛒</span>
          <h1 className={styles.title}>Criar conta</h1>
          <p className={styles.subtitle}>Preencha os dados para se registrar</p>
        </div>

        {success && <div className={styles.success}>{success}</div>}
        {apiError && <div className={styles.error}>{apiError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>

          <div className={styles.sectionTitle}>Dados pessoais</div>
          <div className={styles.row}>
            <Field label="Nome" error={errors.firstname?.message}>
              <input {...register('firstname')} className={ic(styles, errors.firstname)} placeholder="João" />
            </Field>
            <Field label="Sobrenome" error={errors.lastname?.message}>
              <input {...register('lastname')} className={ic(styles, errors.lastname)} placeholder="Silva" />
            </Field>
          </div>
          <div className={styles.row}>
            <Field label="Nome de usuário" error={errors.username?.message}>
              <input {...register('username')} className={ic(styles, errors.username)} placeholder="joao_silva" />
            </Field>
            <Field label="Telefone" error={errors.phone?.message}>
              <input {...register('phone')} className={ic(styles, errors.phone)} placeholder="(21) 99999-0000" />
            </Field>
          </div>

          <div className={styles.sectionTitle}>Acesso</div>
          <Field label="E-mail" error={errors.email?.message}>
            <input {...register('email')} type="email" className={ic(styles, errors.email)} placeholder="joao@email.com" />
          </Field>
          <div className={styles.row}>
            <Field label="Senha" error={errors.password?.message}>
              <input {...register('password')} type="password" className={ic(styles, errors.password)} placeholder="Mínimo 6 caracteres" />
            </Field>
            <Field label="Confirmar senha" error={errors.confirmPassword?.message}>
              <input {...register('confirmPassword')} type="password" className={ic(styles, errors.confirmPassword)} placeholder="Repita a senha" />
            </Field>
          </div>

          <div className={styles.sectionTitle}>Endereço</div>
          <div className={styles.row}>
            <Field label="Cidade" error={errors.city?.message}>
              <input {...register('city')} className={ic(styles, errors.city)} placeholder="Rio de Janeiro" />
            </Field>
            <Field label="CEP" error={errors.zipcode?.message}>
              <input {...register('zipcode')} className={ic(styles, errors.zipcode)} placeholder="20000-000" />
            </Field>
          </div>
          <div className={styles.row}>
            <Field label="Rua" error={errors.street?.message}>
              <input {...register('street')} className={ic(styles, errors.street)} placeholder="Av. Brasil" />
            </Field>
            <Field label="Número" error={errors.number?.message}>
              <input {...register('number')} type="number" className={ic(styles, errors.number)} placeholder="123" />
            </Field>
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            <FiUserPlus /> {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className={styles.loginLink}>
          Já tem conta?{' '}
          <Link to="/login" className={styles.loginAnchor}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}

function ic(styles, error) {
  return `${styles.input}${error ? ' ' + styles.inputError : ''}`;
}

function Field({ label, error, children }) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 5, color: 'var(--text-secondary)' }}>{label}</label>
      {children}
      {error && <span style={{ fontSize: 12, color: 'var(--color-danger)', display: 'block', marginTop: 4 }}>{error}</span>}
    </div>
  );
}
