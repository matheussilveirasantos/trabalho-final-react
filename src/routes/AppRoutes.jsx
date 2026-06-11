import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Products from '../pages/Products';
import ProductDetails from '../pages/ProductDetails';
import AddProduct from '../pages/AddProduct';
import EditProduct from '../pages/EditProduct';
import Users from '../pages/Users';
import UserDetails from '../pages/UserDetails';
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
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard */}
      <Route path="/" element={<Protected><Products /></Protected>} />

      {/* Produtos */}
      <Route path="/products" element={<Protected><Products /></Protected>} />
      <Route path="/products/add" element={<Protected><AddProduct /></Protected>} />
      <Route path="/products/edit/:id" element={<Protected><EditProduct /></Protected>} />
      <Route path="/products/:id" element={<Protected><ProductDetails /></Protected>} />

      {/* Usuários */}
      <Route path="/users" element={<Protected><Users /></Protected>} />
      <Route path="/users/register" element={<Protected><Register /></Protected>} />
      <Route path="/users/:id" element={<Protected><UserDetails /></Protected>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}


