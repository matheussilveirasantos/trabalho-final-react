import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getProduct, updateProduct, getCategories } from "../../services/api";
import Loader from "../../components/Loader";
import Button from "../../components/Button/Button";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import styles from "./styles.module.css";

const schema = yup.object({
  title: yup
    .string()
    .required("Título obrigatório")
    .min(3, "Mínimo 3 caracteres"),
  price: yup
    .number()
    .typeError("Preço deve ser um número")
    .positive("Preço deve ser positivo")
    .required("Preço obrigatório"),
  description: yup
    .string()
    .required("Descrição obrigatória")
    .min(10, "Mínimo 10 caracteres"),
  category: yup.string().required("Categoria obrigatória"),
  image: yup.string().url("URL inválida").required("URL da imagem obrigatória"),
});

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    Promise.all([getProduct(id), getCategories()])
      .then(([prodRes, catRes]) => {
        const p = prodRes.data;
        setCategories(catRes.data);
        reset({
          title: p.title,
          price: p.price,
          description: p.description,
          category: p.category,
          image: p.image,
        });
      })
      .catch(() => setApiError("Erro ao carregar produto."))
      .finally(() => setLoading(false));
  }, [id, reset]);

  async function onSubmit(data) {
    setSaving(true);
    setApiError("");
    setSuccess("");
    try {
      await updateProduct(id, { ...data, price: Number(data.price) });
      setSuccess("Produto atualizado com sucesso!");
    } catch {
      setApiError("Erro ao atualizar produto. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loader text="Carregando produto..." />;

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Button variant="secondary" onClick={() => navigate("/products")}>
          <FiArrowLeft /> Voltar
        </Button>
        <h2 className={styles.pageTitle}>Editar Produto #{id}</h2>
      </div>

      <div className={styles.card}>
        {success && <div className={styles.success}>{success}</div>}
        {apiError && <div className={styles.error}>{apiError}</div>}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
          noValidate
        >
          <div className={styles.field}>
            <label className={styles.label}>Título</label>
            <input
              {...register("title")}
              className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
              placeholder="Nome do produto"
            />
            {errors.title && (
              <span className={styles.fieldError}>{errors.title.message}</span>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Preço (US$)</label>
              <input
                {...register("price")}
                type="number"
                step="0.01"
                className={`${styles.input} ${errors.price ? styles.inputError : ""}`}
                placeholder="0.00"
              />
              {errors.price && (
                <span className={styles.fieldError}>
                  {errors.price.message}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Categoria</label>
              <select
                {...register("category")}
                className={`${styles.input} ${errors.category ? styles.inputError : ""}`}
              >
                <option value="">Selecione...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className={styles.fieldError}>
                  {errors.category.message}
                </span>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>URL da Imagem</label>
            <input
              {...register("image")}
              className={`${styles.input} ${errors.image ? styles.inputError : ""}`}
              placeholder="https://..."
            />
            {errors.image && (
              <span className={styles.fieldError}>{errors.image.message}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Descrição</label>
            <textarea
              {...register("description")}
              className={`${styles.input} ${styles.textarea} ${errors.description ? styles.inputError : ""}`}
              placeholder="Descreva o produto..."
              rows={4}
            />
            {errors.description && (
              <span className={styles.fieldError}>
                {errors.description.message}
              </span>
            )}
          </div>

          <div className={styles.formActions}>
            {/* Trocamos a tag <button> pelo componente <Button /> da equipe */}
            <Button
              type="button"
              variant="secondary" // Isso vai dar o contorno neutro que criamos
              onClick={(e) => {
                e.preventDefault();
                navigate(`/products/${id}`);
              }}
            >
              Ver Detalhes
            </Button>

            <Button type="submit" variant="default" disabled={saving}>
              <FiSave /> {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
