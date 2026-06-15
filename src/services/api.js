/**
 * INFRAESTRUTURA: AppRoutes (Arquiteto de Rotas e Layout Coesivo)
 * FUNÇÃO: (Path) caminhos (URLs) do sistema, isola as páginas públicas, protege as rotas privadas 
 * UTILIZOU:
 * - Rotas (Routes, Route) publicas e privadas, para mapeamento de caminhos estáticos e dinâmicos (/:id).
 * - Rota curinga (path="*") par direcionar a pagina de erro (404)
 */
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 10000,
});

export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const getProductsByCategory = (category) => api.get(`/products/category/${category}`);
export const getCategories = () => api.get('/products/categories');
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const loginUser = (credentials) => api.post('/auth/login', credentials);

