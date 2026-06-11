import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getUser, updateUser } from '../../services/api';
import Loader from '../../components/Loader';
import { FiArrowLeft, FiSave, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import styles from './styles.module.css';

const schema = yup.object({
  firstname: yup.string().required('Nome obrigatório').min(2, 'Mínimo 2 caracteres'),
  lastname: yup.string().required('Sobrenome obrigatório').min(2, 'Mínimo 2 caracteres'),
  username: yup.string().required('Usuário obrigatório').min(3, 'Mínimo 3 caracteres'),
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  phone: yup.string().required('Telefone obrigatório'),
  city: yup.string().required('Cidade obrigatória'),
  street: yup.string().required('Rua obrigatória'),
  number: yup.number().typeError('Número inválido').required('Número obrigatório'),
  zipcode: yup.string().required('CEP obrigatório'),
});

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');
  const [userData, setUserData] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getUser(id)
      .then(res => {
        const u = res.data;
        setUserData(u);
        reset({
          firstname: u.name?.firstname,
          lastname: u.name?.lastname,
          username: u.username,
          email: u.email,
          phone: u.phone,
          city: u.address?.city,
          street: u.address?.street,
          number: u.address?.number,
          zipcode: u.address?.zipcode,
        });
      })
      .catch(() => setApiError('Usuário não encontrado.'))
      .finally(() => setLoading(false));
  }, [id, reset]);

  async function onSubmit(data) {
    setSaving(true);
    setSuccess('');
    setApiError('');
    try {
      const payload = {
        email: data.email,
        username: data.username,
        password: userData?.password ?? '',
        name: { firstname: data.firstname, lastname: data.lastname },
        address: {
          city: data.city,
          street: data.street,
          number: Number(data.number),
          zipcode: data.zipcode,
          geolocation: userData?.address?.geolocation ?? { lat: '0', long: '0' },
        },
        phone: data.phone,
      };
      await updateUser(id, payload);
      setSuccess('Usuário atualizado com sucesso!');
    } catch {
      setApiError('Erro ao atualizar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loader text="Carregando usuário..." />;

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className="btn btn-secondary" onClick={() => navigate('/users')}>
          <FiArrowLeft /> Voltar
        </button>
        <h2 className={styles.pageTitle}>
          Editar usuário #{id}
        </h2>
      </div>

      {userData && (
        <div className={styles.profileBar}>
          <div className={styles.bigAvatar}>
            {(userData.name?.firstname?.[0] ?? '?').toUpperCase()}
            {(userData.name?.lastname?.[0] ?? '').toUpperCase()}
          </div>
          <div>
            <p className={styles.fullName}>{userData.name?.firstname} {userData.name?.lastname}</p>
            <div className={styles.metaRow}>
              <span><FiMail /> {userData.email}</span>
              <span><FiPhone /> {userData.phone}</span>
              <span><FiMapPin /> {userData.address?.city}</span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.card}>
        {success && <div className={styles.success}>{success}</div>}
        {apiError && <div className={styles.error}>{apiError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
          <div className={styles.sectionTitle}>Dados pessoais</div>
          <div className={styles.row}>
            <Field label="Nome" error={errors.firstname?.message}>
              <input {...register('firstname')} className={ic(errors.firstname)} />
            </Field>
            <Field label="Sobrenome" error={errors.lastname?.message}>
              <input {...register('lastname')} className={ic(errors.lastname)} />
            </Field>
          </div>
          <div className={styles.row}>
            <Field label="Nome de usuário" error={errors.username?.message}>
              <input {...register('username')} className={ic(errors.username)} />
            </Field>
            <Field label="Telefone" error={errors.phone?.message}>
              <input {...register('phone')} className={ic(errors.phone)} />
            </Field>
          </div>

          <div className={styles.sectionTitle}>Acesso</div>
          <Field label="E-mail" error={errors.email?.message}>
            <input {...register('email')} type="email" className={ic(errors.email)} />
          </Field>

          <div className={styles.sectionTitle}>Endereço</div>
          <div className={styles.row}>
            <Field label="Cidade" error={errors.city?.message}>
              <input {...register('city')} className={ic(errors.city)} />
            </Field>
            <Field label="CEP" error={errors.zipcode?.message}>
              <input {...register('zipcode')} className={ic(errors.zipcode)} />
            </Field>
          </div>
          <div className={styles.row}>
            <Field label="Rua" error={errors.street?.message}>
              <input {...register('street')} className={ic(errors.street)} />
            </Field>
            <Field label="Número" error={errors.number?.message}>
              <input {...register('number')} type="number" className={ic(errors.number)} />
            </Field>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <FiSave /> {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ic(error) {
  return `${styles.input}${error ? ' ' + styles.inputError : ''}`;
}

function Field({ label, error, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  );
}
