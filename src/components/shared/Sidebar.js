import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import {
  LayoutDashboard, Package, ShoppingCart, FileText, Store,
  Settings, LogOut, Users, BarChart3, Bell, ChevronLeft, Menu, Shield
} from 'lucide-react';

export default function Sidebar() {
  const { profile, signOut, isAdmin } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const vendorLinks = [
    { to: '/dashboard', icon: <LayoutDashboard />, label: t('dashboard') },
    { to: '/products', icon: <Package />, label: t('products') },
    { to: '/orders', icon: <ShoppingCart />, label: t('orders') },
    { to: '/invoices', icon: <FileText />, label: t('invoices') },
    { to: '/shop', icon: <Store />, label: t('shop') },
  ];

  const adminLinks = [
    { to: '/admin', icon: <LayoutDashboard />, label: t('dashboard') },
    { to: '/admin/vendors', icon: <Users />, label: t('allVendors') },
    { to: '/admin/orders', icon: <ShoppingCart />, label: t('allOrders') },
    { to: '/admin/invoices', icon: <FileText />, label: t('allInvoices') },
    { to: '/admin/stats', icon: <BarChart3 />, label: 'Statistiques' },
  ];

  const links = isAdmin ? adminLinks : vendorLinks;
  const initials = profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  return (
    <>
      {/* Mobile toggle */}
      <button className="mobile-toggle btn btn-ghost" style={{ position: 'fixed', top: 14, left: 14, zIndex: 300 }} onClick={() => setOpen(true)}>
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 150 }} />}

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="logo-text">DIAGOSO</div>
              <div className="logo-sub">La Maison du Commerce</div>
            </div>
            {isAdmin && (
              <span style={{ background: 'var(--color-warning)', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>
                ADMIN
              </span>
            )}
            <button className="btn btn-ghost btn-sm mobile-toggle" onClick={() => setOpen(false)}>
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {isAdmin && <div className="nav-section"><Shield size={10} style={{ display: 'inline', marginRight: 4 }} />Administration</div>}
          {!isAdmin && <div className="nav-section">Gestion</div>}

          {links.map(link => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setOpen(false)}>
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}

          <div className="nav-section" style={{ marginTop: 8 }}>Compte</div>

          <NavLink to={isAdmin ? '/admin/settings' : '/settings'} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setOpen(false)}>
            <Settings /><span>{t('settings')}</span>
          </NavLink>

          <NavLink to="/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setOpen(false)}>
            <Bell /><span>{t('notifications')}</span>
          </NavLink>
        </nav>

        {/* User footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile?.full_name}</div>
              <div className="user-role">{isAdmin ? '👑 Propriétaire' : profile?.shop_name}</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={async () => { await signOut(); navigate('/login'); }} title={t('logout')}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
