import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LangProvider } from './context/LangContext';
import './styles/global.css';

import Sidebar       from './components/shared/Sidebar';
import Header        from './components/shared/Header';
import Landing       from './pages/Landing';
import Login         from './pages/auth/Login';
import Register      from './pages/auth/Register';
import Dashboard     from './pages/vendor/Dashboard';
import Products      from './pages/vendor/Products';
import Orders        from './pages/vendor/Orders';
import OrderDetail   from './pages/vendor/OrderDetail';
import Invoices      from './pages/vendor/Invoices';
import Shop          from './pages/vendor/Shop';
import Settings      from './pages/vendor/Settings';
import Notifications from './pages/vendor/Notifications';
import PublicShop    from './pages/vendor/PublicShop';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVendors   from './pages/admin/AdminVendors';
import AdminInvoices  from './pages/admin/AdminInvoices';

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

function Loader() {
  return <div className="loading-screen"><div className="spinner" /><p>Chargement...</p></div>;
}

/* ── Guards ── */

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user)   return <Navigate to="/login" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { user, profile, loading } = useAuth();
  if (loading)  return <Loader />;
  if (!user)    return <Navigate to="/login" replace />;
  if (!profile) return <Loader />;
  if (profile.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

function RequireVendor({ children }) {
  const { user, profile, loading } = useAuth();
  if (loading)  return <Loader />;
  if (!user)    return <Navigate to="/login" replace />;
  if (!profile) return <Loader />;
  if (profile.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
}

// Si connecté → redirige vers bon espace, sinon → affiche enfant (login/register)
function RedirectIfAuth({ children }) {
  const { user, profile, loading } = useAuth();
  if (loading)  return <Loader />;
  if (!user)    return children;
  if (!profile) return <Loader />;
  return <Navigate to={profile.role === 'admin' ? '/admin' : '/dashboard'} replace />;
}

function AppRoutes() {
  return (
    <LangProvider>
      <Routes>

        {/* ── PUBLIQUES — jamais de redirection ── */}
        <Route path="/"               element={<Landing />} />
        <Route path="/boutique/:slug" element={<PublicShop />} />

        {/* ── AUTH ── */}
        <Route path="/login"    element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
        <Route path="/register" element={<RedirectIfAuth><Register /></RedirectIfAuth>} />

        {/* ── VENDEUR ── */}
        <Route path="/dashboard"  element={<RequireVendor><AppLayout title="Tableau de bord"><Dashboard /></AppLayout></RequireVendor>} />
        <Route path="/products"   element={<RequireVendor><AppLayout title="Produits"><Products /></AppLayout></RequireVendor>} />
        <Route path="/orders"     element={<RequireVendor><AppLayout title="Commandes"><Orders /></AppLayout></RequireVendor>} />
        <Route path="/orders/:id" element={<RequireVendor><AppLayout title="Détail commande"><OrderDetail /></AppLayout></RequireVendor>} />
        <Route path="/invoices"   element={<RequireVendor><AppLayout title="Factures"><Invoices /></AppLayout></RequireVendor>} />
        <Route path="/shop"       element={<RequireVendor><AppLayout title="Ma Boutique"><Shop /></AppLayout></RequireVendor>} />

        {/* ── PARTAGÉS ── */}
        <Route path="/settings"      element={<RequireAuth><AppLayout title="Paramètres"><Settings /></AppLayout></RequireAuth>} />
        <Route path="/notifications" element={<RequireAuth><AppLayout title="Notifications"><Notifications /></AppLayout></RequireAuth>} />

        {/* ── ADMIN ── */}
        <Route path="/admin"          element={<RequireAdmin><AppLayout title="Administration"><AdminDashboard /></AppLayout></RequireAdmin>} />
        <Route path="/admin/vendors"  element={<RequireAdmin><AppLayout title="Vendeurs"><AdminVendors /></AppLayout></RequireAdmin>} />
        <Route path="/admin/invoices" element={<RequireAdmin><AppLayout title="Factures"><AdminInvoices /></AppLayout></RequireAdmin>} />
        <Route path="/admin/orders"   element={<RequireAdmin><AppLayout title="Commandes"><Orders /></AppLayout></RequireAdmin>} />
        <Route path="/admin/settings" element={<RequireAdmin><AppLayout title="Paramètres"><Settings /></AppLayout></RequireAdmin>} />

        {/* 404 → landing */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </LangProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, borderRadius: 10 }
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}