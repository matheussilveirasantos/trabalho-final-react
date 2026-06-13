/**
 * INFRAESTRUTURA: AppRoutes - rotas da aplicação
 * FUNÇÃO: (Path) caminhos (URLs) do sistema, isola as páginas públicas, protege as rotas privadas 
 * UTILIZOU:
 * - Rotas (Routes, Route) publicas e privadas, para mapeamento de caminhos estáticos e dinâmicos (/:id).
 * - Rota curinga (path="*") par direcionar a pagina de erro (404)
 */
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Login from '../pages/Login';
import Products from '../pages/Products';
import ProductDetails from '../pages/ProductDetails';
import AddProduct from '../pages/AddProduct';
import EditProduct from '../pages/EditProduct';
import NotFound from '../pages/NotFound';
import styles from './AppRoutes.module.css';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className={styles.layout}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={styles.main}>
        <Header onToggleSidebar={() => setSidebarOpen(o => !o)} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}

function Protected({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
  
      <Route path="/login" element={<Login />} />
   
      <Route path="/" element={<Protected><Products /></Protected>} />
  
      <Route path="/products" element={<Protected><Products /></Protected>} />
      <Route path="/products/add" element={<Protected><AddProduct /></Protected>} />
      <Route path="/products/edit/:id" element={<Protected><EditProduct /></Protected>} />
      <Route path="/products/:id" element={<Protected><ProductDetails /></Protected>} />


      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}


