import React, { useEffect, useState } from 'react';
import { useLang } from '../../context/LangContext';
import { supabase } from '../../lib/supabase';
import { Users, ShoppingCart, TrendingUp, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { generateSubscriptionPDF } from '../../components/vendor/InvoicePDF';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { t } = useLang();
  const [stats, setStats] = useState({ vendors: 0, active: 0, orders: 0, revenue: 0, monthlyRevenue: 0 });
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [vendorsRes, ordersRes, invoicesRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('role', 'vendor'),
      supabase.from('orders').select('total, payment_status, created_at'),
      supabase.from('invoices').select('amount, status, created_at')
    ]);

    const vs = vendorsRes.data || [];
    const os = ordersRes.data || [];
    const invs = invoicesRes.data || [];

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthOrders = os.filter(o => o.created_at >= monthStart);
    const paidInvoices = invs.filter(i => i.status === 'paid');

    setStats({
      vendors: vs.length,
      active: vs.filter(v => v.subscription_status === 'active' || v.subscription_status === 'trial').length,
      orders: os.length,
      revenue: paidInvoices.reduce((s, i) => s + Number(i.amount), 0),
      monthlyRevenue: paidInvoices.filter(i => i.created_at >= monthStart).reduce((s, i) => s + Number(i.amount), 0)
    });
    setVendors(vs.slice(0, 8));
    setLoading(false);
  };

  const generateMonthlyInvoices = async () => {
    const { data: vendors } = await supabase.from('profiles').select('*').eq('role', 'vendor').in('subscription_status', ['active', 'trial']);
    if (!vendors?.length) return toast.error('Aucun vendeur actif');

    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    const invNum = (v) => `INV-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}-${Math.floor(Math.random()*9000+1000)}`;

    let created = 0;
    for (const v of vendors) {
      const { error } = await supabase.from('invoices').insert({
        invoice_number: invNum(v), vendor_id: v.id, amount: 10000,
        period_start: periodStart, period_end: periodEnd, status: 'pending'
      });
      if (!error) created++;
    }
    toast.success(`✅ ${created} factures générées pour ${vendors.length} vendeurs !`);
    load();
  };

  const fmt = n => Number(n).toLocaleString('fr-FR') + ' FCFA';

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">👑 Panel Administrateur</h1>
          <p className="page-subtitle">Vue d'ensemble de la plateforme DIAGOSO</p>
        </div>
        <button className="btn btn-primary" onClick={generateMonthlyInvoices}>
          <FileText size={16} /> {t('generateMonthlyInvoices')}
        </button>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon"><Users /></div>
          <div className="stat-label">{t('totalVendors')}</div>
          <div className="stat-value">{stats.vendors}</div>
          <div className="stat-change">{stats.active} actifs</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><CheckCircle /></div>
          <div className="stat-label">{t('activeVendors')}</div>
          <div className="stat-value" style={{ color: 'var(--color-success)' }}>{stats.active}</div>
          <div className="stat-change">En service</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><ShoppingCart /></div>
          <div className="stat-label">Commandes totales</div>
          <div className="stat-value">{stats.orders}</div>
          <div className="stat-change">Toute la plateforme</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#b45309' }}><TrendingUp /></div>
          <div className="stat-label">{t('platformRevenue')}</div>
          <div className="stat-value" style={{ fontSize: 18 }}>{fmt(stats.revenue)}</div>
          <div className="stat-change">{fmt(stats.monthlyRevenue)} ce mois</div>
        </div>
      </div>

      {/* Revenue calc */}
      <div style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))', borderRadius: 16, padding: 24, marginBottom: 24, color: 'white' }}>
        <h3 style={{ fontWeight: 700, marginBottom: 4 }}>💰 Projection revenus plateforme</h3>
        <p style={{ opacity: 0.8, fontSize: 13, marginBottom: 16 }}>Basé sur {stats.active} vendeurs actifs × 5 000 FCFA/mois</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'Ce mois', value: stats.active * 5000 },
            { label: 'Trimestre', value: stats.active * 5000 * 3 },
            { label: 'Année', value: stats.active * 5000 * 12 }
          ].map(item => (
            <div key={item.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{fmt(item.value)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent vendors */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">🏪 Derniers vendeurs inscrits</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Vendeur</th><th>Boutique</th><th>Email</th><th>Abonnement</th><th>Inscription</th></tr></thead>
            <tbody>
              {vendors.map(v => (
                <tr key={v.id}>
                  <td style={{ fontWeight: 600 }}>{v.full_name}</td>
                  <td>{v.shop_name}</td>
                  <td className="td-muted">{v.email}</td>
                  <td>
                    <span className={`badge ${v.subscription_status==='active'?'badge-success':v.subscription_status==='trial'?'badge-warning':'badge-danger'}`}>
                      {v.subscription_status==='trial'?'🎁 Essai':v.subscription_status==='active'?'✅ Actif':'❌ Inactif'}
                    </span>
                  </td>
                  <td className="td-muted">{new Date(v.created_at).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
