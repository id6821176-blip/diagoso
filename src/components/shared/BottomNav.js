import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { LayoutDashboard, Package, ShoppingCart, Store, Users, FileText } from 'lucide-react';

export default function BottomNav() {
  const { isAdmin } = useAuth();
  const { t } = useLang();

  const vendorItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={22} />, label: 'Accueil' },
    { to: '/products',  icon: <Package size={22} />,         label: 'Produits' },
    { to: '/orders',    icon: <ShoppingCart size={22} />,    label: 'Cmdes' },
    { to: '/shop',      icon: <Store size={22} />,           label: 'Boutique' },
    { to: '/invoices',  icon: <FileText size={22} />,        label: 'Factures' },
  ];

  const adminItems = [
    { to: '/admin',          icon: <LayoutDashboard size={22} />, label: 'Dashboard' },
    { to: '/admin/vendors',  icon: <Users size={22} />,           label: 'Vendeurs' },
    { to: '/admin/orders',   icon: <ShoppingCart size={22} />,    label: 'Cmdes' },
    { to: '/admin/invoices', icon: <FileText size={22} />,        label: 'Factures' },
  ];

  const items = isAdmin ? adminItems : vendorItems;

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-items">
        {items.map(item => (
          <NavLink key={item.to} to={item.to}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}