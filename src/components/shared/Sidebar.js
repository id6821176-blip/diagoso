import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import {
  LayoutDashboard, Package, ShoppingCart, FileText, Store,
  Settings, LogOut, Users, BarChart3, Bell, Shield, X, Menu
} from 'lucide-react';

export default function Sidebar({ open, onClose }) {
  const { profile, signOut, isAdmin } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();

  const vendorLinks = [
    { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: t('dashboard') },
    { to: '/products',  icon: <Package size={18} />,         label: t('products') },
    { to: '/orders',    icon: <ShoppingCart size={18} />,    label: t('orders') },
    { to: '/invoices',  icon: <FileText size={18} />,        label: t('invoices') },
    { to: '/shop',      icon: <Store size={18} />,           label: t('shop') },
  ];

  const adminLinks = [
    { to: '/admin',          icon: <LayoutDashboard size={18} />, label: t('dashboard') },
    { to: '/admin/vendors',  icon: <Users size={18} />,           label: t('allVendors') },
    { to: '/admin/orders',   icon: <ShoppingCart size={18} />,    label: t('allOrders') },
    { to: '/admin/invoices', icon: <FileText size={18} />,        label: t('allInvoices') },
    { to: '/admin/stats',    icon: <BarChart3 size={18} />,       label: 'Statistiques' },
  ];

  const links = isAdmin ? adminLinks : vendorLinks;
  const initials = profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  const handleNav = () => { if (onClose) onClose(); };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <>
      {/* Overlay */}
      <div className={`sidebar-overlay ${open ? 'open' : ''}`} onClick={onClose} />

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="logo-text">🏪 DIAGOSO</div>
              <div className="logo-sub">La Maison du Commerce</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {isAdmin && (
                <span style={{ background: 'var(--color-warning)', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>ADMIN</span>
              )}
              {/* Bouton fermer sur mobile */}
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-text3)', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {isAdmin
            ? <div className="nav-section"><Shield size={10} style={{ display:'inline', marginRight:4 }} />Administration</div>
            : <div className="nav-section">Gestion</div>
          }

          {links.map(link => (
            <NavLink key={link.to} to={link.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={handleNav}>
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}

          <div className="nav-section" style={{ marginTop: 8 }}>Compte</div>

          <NavLink to={isAdmin ? '/admin/settings' : '/settings'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={handleNav}>
            <Settings size={18} /><span>{t('settings')}</span>
          </NavLink>

          <NavLink to="/notifications"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={handleNav}>
            <Bell size={18} /><span>{t('notifications')}</span>
          </NavLink>
        </nav>

        {/* Footer utilisateur */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="user-name" style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {profile?.full_name}
              </div>
              <div className="user-role">{isAdmin ? '👑 Propriétaire' : profile?.shop_name}</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout} title={t('logout')}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}