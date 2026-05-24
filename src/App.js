import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LangProvider } from './context/LangContext';
import './styles/global.css';

// Shared
import Sidebar from './components/shared/Sidebar';
import Header from './components/shared/Header';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Vendor
import Dashboard from './pages/vendor/Dashboard';
import Products from './pages/vendor/Products';
import Orders from './pages/vendor/Orders';
import OrderDetail from './pages/vendor/OrderDetail';
import Invoices from './pages/vendor/Invoices';
import Shop from './pages/vendor/Shop';
import Settings from './pages/vendor/Settings';
import Notifications from './pages/vendor/Notifications';
import PublicShop from './pages/vendor/PublicShop';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVendors from './pages/admin/AdminVendors';
import AdminInvoices from './pages/admin/AdminInvoices';

// ── Protected layout ──────────────────────────────────────────────────────
function AppLayout({ children, title }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header title={title} />
        {children}
      </div>
    </div>
  );
}

// ── Route guards ──────────────────────────────────────────────────────────
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /><p>Chargement...</p></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

function RedirectIfAuth({ children }) {
  const { user, profile, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (user) return <Navigate to={profile?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return children;
}

// ── Inner app (has access to auth context) ────────────────────────────────
function AppRoutes() {
  return (
    <LangProvider>
      <Routes>
        {/* Public */}
        <Route path="/boutique/:slug" element={<PublicShop />} />

        {/* Auth */}
        <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
        <Route path="/register" element={<RedirectIfAuth><Register /></RedirectIfAuth>} />

        {/* Vendor routes */}
        <Route path="/dashboard" element={
          <RequireAuth>
            <AppLayout title="Tableau de bord">
              <Dashboard />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/products" element={
          <RequireAuth>
            <AppLayout title="Produits">
              <Products />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/orders" element={
          <RequireAuth>
            <AppLayout title="Commandes">
              <Orders />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/orders/:id" element={
          <RequireAuth>
            <AppLayout title="Détail commande">
              <OrderDetail />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/invoices" element={
          <RequireAuth>
            <AppLayout title="Factures abonnement">
              <Invoices />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/shop" element={
          <RequireAuth>
            <AppLayout title="Ma Boutique">
              <Shop />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/settings" element={
          <RequireAuth>
            <AppLayout title="Paramètres">
              <Settings />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/notifications" element={
          <RequireAuth>
            <AppLayout title="Notifications">
              <Notifications />
            </AppLayout>
          </RequireAuth>
        } />

        {/* Admin routes */}
        <Route path="/admin" element={
          <RequireAdmin>
            <AppLayout title="Administration">
              <AdminDashboard />
            </AppLayout>
          </RequireAdmin>
        } />
        <Route path="/admin/vendors" element={
          <RequireAdmin>
            <AppLayout title="Gestion vendeurs">
              <AdminVendors />
            </AppLayout>
          </RequireAdmin>
        } />
        <Route path="/admin/invoices" element={
          <RequireAdmin>
            <AppLayout title="Factures abonnements">
              <AdminInvoices />
            </AppLayout>
          </RequireAdmin>
        } />
        <Route path="/admin/orders" element={
          <RequireAdmin>
            <AppLayout title="Toutes les commandes">
              <Orders />
            </AppLayout>
          </RequireAdmin>
        } />
        <Route path="/admin/settings" element={
          <RequireAdmin>
            <AppLayout title="Paramètres admin">
              <Settings />
            </AppLayout>
          </RequireAdmin>
        } />

        {/* Default redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </LangProvider>
  );
}

// ── Root App ───────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, borderRadius: 10 } }} />
      </AuthProvider>
    </BrowserRouter>
  );
}
