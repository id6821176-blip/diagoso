import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { supabase } from '../../lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ShoppingCart, Package, TrendingUp, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Dashboard() {
  const { profile } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, pending: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (profile?.id) loadDashboard(); }, [profile]);

  const loadDashboard = async () => {
    const id = profile.id;
    const [ordersRes, productsRes, lowStockRes] = await Promise.all([
      supabase.from('orders').select('*, order_items(*)').eq('vendor_id', id).order('created_at', { ascending: false }),
      supabase.from('products').select('*').eq('vendor_id', id),
      supabase.from('products').select('*').eq('vendor_id', id).lte('stock_quantity', 5).gt('stock_quantity', 0)
    ]);

    const orders = ordersRes.data || [];
    const products = productsRes.data || [];

    const revenue = orders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + Number(o.total), 0);
    const pending = orders.filter(o => o.status === 'pending').length;

    setStats({ revenue, orders: orders.length, products: products.length, pending });
    setRecentOrders(orders.slice(0, 6));
    setLowStock(lowStockRes.data || []);

    // Build 7-day chart
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      const dayStr = format(d, 'yyyy-MM-dd');
      const dayOrders = orders.filter(o => o.created_at?.startsWith(dayStr));
      return {
        date: format(d, 'EEE', { locale: fr }),
        ventes: dayOrders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + Number(o.total), 0),
        commandes: dayOrders.length
      };
    });
    setChartData(days);
    setLoading(false);
  };

  const statusBadge = (status) => {
    const map = { pending: 'badge-warning', confirmed: 'badge-info', processing: 'badge-info', shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-danger' };
    const labels = { pending: t('pending'), confirmed: t('confirmed'), processing: t('processing'), shipped: t('shipped'), delivered: t('delivered'), cancelled: t('cancelled') };
    return <span className={`badge ${map[status] || 'badge-gray'}`}>{labels[status] || status}</span>;
  };

  const fmt = (n) => Number(n).toLocaleString('fr-FR') + ' FCFA';

  if (loading) return <div className="loading-screen"><div className="spinner" /><p>{t('loading')}</p></div>;

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  return (
    <div className="page-content">
      {/* Welcome */}
      <div className="page-header">
        <div>
          <h1 className="page-title">👋 {greet}, {profile?.full_name?.split(' ')[0]} !</h1>
          <p className="page-subtitle">{profile?.shop_name} · Voici un résumé de votre activité</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/orders/new')}>
          <ShoppingCart size={16} /> Nouvelle commande
        </button>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon"><TrendingUp /></div>
          <div className="stat-label">{t('totalRevenue')}</div>
          <div className="stat-value" style={{ fontSize: 20 }}>{fmt(stats.revenue)}</div>
          <div className="stat-change">↗ Ce mois</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><ShoppingCart /></div>
          <div className="stat-label">{t('totalOrders')}</div>
          <div className="stat-value">{stats.orders}</div>
          <div className="stat-change">Total commandes</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Package /></div>
          <div className="stat-label">{t('totalProducts')}</div>
          <div className="stat-value">{stats.products}</div>
          <div className="stat-change">Produits actifs</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#b45309' }}><Clock /></div>
          <div className="stat-label">{t('pendingOrders')}</div>
          <div className="stat-value" style={{ color: stats.pending > 0 ? '#b45309' : 'inherit' }}>{stats.pending}</div>
          <div className="stat-change" style={{ color: '#b45309' }}>À traiter</div>
        </div>
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="card">
          <div className="card-header"><div className="card-title">📈 Ventes (7 jours)</div></div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => v > 0 ? (v/1000)+'k' : 0} />
              <Tooltip formatter={v => fmt(v)} />
              <Line type="monotone" dataKey="ventes" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">📦 Commandes (7 jours)</div></div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="commandes" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div style={{ background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 12, padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <AlertTriangle size={20} color="#b45309" />
          <div style={{ flex: 1 }}>
            <strong style={{ color: '#b45309', fontSize: 14 }}>Stock faible !</strong>
            <span style={{ color: '#92400e', fontSize: 13, marginLeft: 8 }}>
              {lowStock.map(p => p.name).join(', ')} — Pensez à réapprovisionner
            </span>
          </div>
          <button className="btn btn-sm" style={{ background: '#b45309', color: 'white' }} onClick={() => navigate('/products')}>Gérer</button>
        </div>
      )}

      {/* Recent orders */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">🛒 {t('recentOrders')}</div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/orders')}>
            Voir tout <ArrowRight size={14} />
          </button>
        </div>
        {recentOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><ShoppingCart /></div>
            <h3>Aucune commande</h3>
            <p>Vos commandes apparaîtront ici</p>
            <button className="btn btn-primary" onClick={() => navigate('/orders/new')}>Créer une commande</button>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>N° Commande</th><th>Client</th><th>Total</th><th>Statut</th><th>Date</th>
              </tr></thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/orders/${o.id}`)}>
                    <td><strong>{o.order_number}</strong></td>
                    <td>
                      <div>{o.customer_name}</div>
                      <div className="td-muted">{o.customer_phone}</div>
                    </td>
                    <td><strong>{fmt(o.total)}</strong></td>
                    <td>{statusBadge(o.status)}</td>
                    <td className="td-muted">{new Date(o.created_at).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
