import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createProduct, getCategories } from '../../services/api';
import { useEffect } from 'react';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import styles from './styles.module.css';

const schema = yup.object({
  title: yup.string().required('Título obrigatório').min(3, 'Mínimo 3 caracteres'),
  price: yup
    .number()
    .typeError('Preço deve ser um número')
    .positive('Preço deve ser positivo')
    .required('Preço obrigatório'),
  description: yup.string().required('Descrição obrigatória').min(10, 'Mínimo 10 caracteres'),
  category: yup.string().required('Categoria obrigatória'),
  image: yup.string().url('URL inválida').required('URL da imagem obrigatória'),
});

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getCategories().then(res => setCategories(res.data));
  }, []);

  async function onSubmit(data) {
    setLoading(true);
    setApiError('');
    setSuccess('');
    try {
      const res = await createProduct({ ...data, price: Number(data.price) });
      setSuccess(`Produto criado com sucesso! (ID simulado: ${res.data.id})`);
      reset();
    } catch {
      setApiError('Erro ao criar produto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className="btn btn-secondary" onClick={() => navigate('/products')}>
          <FiArrowLeft /> Voltar
        </button>
        <h2 className={styles.pageTitle}>Adicionar Produto</h2>
      </div>

      <div className={styles.card}>
        {success && <div className={styles.success}>{success}</div>}
        {apiError && <div className={styles.error}>{apiError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
          <div className={styles.field}>
            <label className={styles.label}>Título</label>
            <input
              {...register('title')}
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              placeholder="Nome do produto"
            />
            {errors.title && <span className={styles.fieldError}>{errors.title.message}</span>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Preço (US$)</label>
              <input
                {...register('price')}
                type="number"
                step="0.01"
                className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
                placeholder="0.00"
              />
              {errors.price && <span className={styles.fieldError}>{errors.price.message}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Categoria</label>
              <select
                {...register('category')}
                className={`${styles.input} ${errors.category ? styles.inputError : ''}`}
              >
                <option value="">Selecione...</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <span className={styles.fieldError}>{errors.category.message}</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>URL da Imagem</label>
            <input
              {...register('image')}
              className={`${styles.input} ${errors.image ? styles.inputError : ''}`}
              placeholder="https://..."
            />
            {errors.image && <span className={styles.fieldError}>{errors.image.message}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Descrição</label>
            <textarea
              {...register('description')}
              className={`${styles.input} ${styles.textarea} ${errors.description ? styles.inputError : ''}`}
              placeholder="Descreva o produto..."
              rows={4}
            />
            {errors.description && <span className={styles.fieldError}>{errors.description.message}</span>}
          </div>

          <div className={styles.formActions}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/products')}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <FiSave /> {loading ? 'Salvando...' : 'Salvar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
