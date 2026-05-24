import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../context/LangContext';
import { Download, Search, CheckCircle } from 'lucide-react';
import { generateSubscriptionPDF } from '../../components/vendor/InvoicePDF';
import toast from 'react-hot-toast';

export default function AdminInvoices() {
  const { t } = useLang();
  const [invoices, setInvoices] = useState([]);
  const [vendors, setVendors] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data: invs } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
    const { data: vs } = await supabase.from('profiles').select('id, full_name, shop_name, email, phone, city').eq('role', 'vendor');
    const vMap = {};
    (vs || []).forEach(v => { vMap[v.id] = v; });
    setInvoices(invs || []);
    setVendors(vMap);
    setLoading(false);
  };

  const markPaid = async (id) => {
    await supabase.from('invoices').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('id', id);
    toast.success('✅ Facture marquée comme payée');
    load();
  };

  const fmt = n => Number(n).toLocaleString('fr-FR') + ' FCFA';

  const statusBadge = (s) => {
    const map = { paid:'badge-success', pending:'badge-warning', overdue:'badge-danger', cancelled:'badge-gray' };
    const labels = { paid:'✅ Payée', pending:'⏳ En attente', overdue:'🚨 En retard', cancelled:'Annulée' };
    return <span className={`badge ${map[s]||'badge-gray'}`}>{labels[s]||s}</span>;
  };

  const filtered = invoices.filter(i => {
    const v = vendors[i.vendor_id];
    const matchSearch = v?.shop_name?.toLowerCase().includes(search.toLowerCase()) || i.invoice_number?.includes(search) || v?.full_name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || i.status === filter;
    return matchSearch && matchFilter;
  });

  const totalPending = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + Number(i.amount), 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">🧾 {t('allInvoices')}</h1>
          <p className="page-subtitle">Gestion des abonnements et paiements</p>
        </div>
      </div>

      {/* Revenue summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--color-success)' }}>
          <div className="stat-label">Revenu encaissé</div>
          <div className="stat-value" style={{ fontSize: 20, color: 'var(--color-success)' }}>{fmt(totalPaid)}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--color-warning)' }}>
          <div className="stat-label">En attente</div>
          <div className="stat-value" style={{ fontSize: 20, color: 'var(--color-warning)' }}>{fmt(totalPending)}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
          <div className="stat-label">Total factures</div>
          <div className="stat-value" style={{ fontSize: 20 }}>{invoices.length}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16, padding: 14 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div className="search-input" style={{ flex: 1, minWidth: 200 }}>
            <Search className="search-icon" />
            <input className="form-input" placeholder="N° facture, nom boutique..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
          </div>
          <select className="form-select" style={{ width: 'auto' }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="paid">Payées</option>
            <option value="overdue">En retard</option>
          </select>
        </div>
      </div>

      {loading ? <div className="loading-screen"><div className="spinner" /></div> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>N° Facture</th><th>Vendeur</th><th>Période</th><th>Montant</th><th>Statut</th><th>Payée le</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(inv => {
                const v = vendors[inv.vendor_id];
                return (
                  <tr key={inv.id}>
                    <td><strong style={{ color: 'var(--color-primary)' }}>{inv.invoice_number}</strong></td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{v?.shop_name}</div>
                      <div className="td-muted">{v?.full_name}</div>
                    </td>
                    <td className="td-muted">
                      {new Date(inv.period_start).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </td>
                    <td><strong>{fmt(inv.amount)}</strong></td>
                    <td>{statusBadge(inv.status)}</td>
                    <td className="td-muted">{inv.paid_at ? new Date(inv.paid_at).toLocaleDateString('fr-FR') : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {inv.status !== 'paid' && (
                          <button className="btn btn-sm" style={{ background: 'var(--color-success)', color: 'white' }} onClick={() => markPaid(inv.id)}>
                            <CheckCircle size={13} /> Payée
                          </button>
                        )}
                        <button className="btn btn-secondary btn-sm" onClick={() => generateSubscriptionPDF(inv, v)}>
                          <Download size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
