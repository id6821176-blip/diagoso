import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { supabase } from '../../lib/supabase';
import { Plus, ShoppingCart, Search, FileText, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import OrderForm from '../../components/vendor/OrderForm';
import InvoicePDF from '../../components/vendor/InvoicePDF';

const STATUS_OPTIONS = ['all','pending','confirmed','processing','shipped','delivered','cancelled'];

export default function Orders() {
  const { profile } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal, setModal] = useState(false);

  useEffect(() => { if (profile?.id) load(); }, [profile]);

  const load = async () => {
    const { data } = await supabase.from('orders').select('*, order_items(*)').eq('vendor_id', profile.id).order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    load();
    toast.success('Statut mis à jour');
  };

  const fmt = (n) => Number(n).toLocaleString('fr-FR') + ' FCFA';

  const statusBadge = (s) => {
    const map = { pending:'badge-warning', confirmed:'badge-info', processing:'badge-info', shipped:'badge-primary', delivered:'badge-success', cancelled:'badge-danger' };
    const labels = { pending:t('pending'), confirmed:t('confirmed'), processing:t('processing'), shipped:t('shipped'), delivered:t('delivered'), cancelled:t('cancelled') };
    return <span className={`badge ${map[s]||'badge-gray'}`}>{labels[s]||s}</span>;
  };

  const payBadge = (s) => <span className={`badge ${s==='paid'?'badge-success':'badge-warning'}`}>{s==='paid'?t('paid'):t('unpaid')}</span>;

  const filtered = orders.filter(o => {
    const matchSearch = o.customer_name?.toLowerCase().includes(search.toLowerCase()) || o.order_number?.includes(search);
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">🛒 {t('orders')}</h1>
          <p className="page-subtitle">{orders.length} commande{orders.length>1?'s':''} au total</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} />{t('newOrder')}</button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 16, padding: 14 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div className="search-input" style={{ flex: 1, minWidth: 200 }}>
            <Search className="search-icon" />
            <input className="form-input" placeholder="Rechercher client, N° commande..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
          </div>
          <select className="form-select" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s==='all'?'Tous les statuts':t(s)}</option>)}
          </select>
        </div>
      </div>

      {loading ? <div className="loading-screen"><div className="spinner" /></div> :
        filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><ShoppingCart /></div>
            <h3>Aucune commande</h3>
            <p>Créez votre première commande pour commencer</p>
            <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} />Nouvelle commande</button>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>N° Commande</th><th>Client</th><th>Articles</th><th>Total</th><th>Paiement</th><th>Statut</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id}>
                    <td><strong style={{ color: 'var(--color-primary)' }}>{o.order_number}</strong></td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{o.customer_name}</div>
                      <div className="td-muted">{o.customer_phone}</div>
                    </td>
                    <td className="td-muted">{o.order_items?.length || 0} article{(o.order_items?.length||0)>1?'s':''}</td>
                    <td><strong>{fmt(o.total)}</strong></td>
                    <td>{payBadge(o.payment_status)}</td>
                    <td>
                      <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                        className="form-select" style={{ padding: '4px 8px', fontSize: 12, width: 'auto' }}>
                        {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s =>
                          <option key={s} value={s}>{t(s)}</option>
                        )}
                      </select>
                    </td>
                    <td className="td-muted">{new Date(o.created_at).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/orders/${o.id}`)}>
                        <FileText size={14} /> Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }

      {modal && <OrderForm onClose={() => setModal(false)} onSaved={() => { setModal(false); load(); }} vendorId={profile?.id} />}
    </div>
  );
}
