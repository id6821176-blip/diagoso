import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../context/LangContext';
import { Search, ExternalLink, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminVendors() {
  const { t } = useLang();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('role', 'vendor').order('created_at', { ascending: false });
    setVendors(data || []);
    setLoading(false);
  };

  const toggleStatus = async (v) => {
    const newStatus = v.subscription_status === 'active' ? 'inactive' : 'active';
    await supabase.from('profiles').update({ subscription_status: newStatus }).eq('id', v.id);
    toast.success('Statut mis à jour');
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Supprimer ce vendeur et toutes ses données ?')) return;
    await supabase.from('profiles').delete().eq('id', id);
    toast.success('Vendeur supprimé');
    load();
  };

  const filtered = vendors.filter(v => {
    const matchSearch = v.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      v.email?.toLowerCase().includes(search.toLowerCase()) ||
      v.shop_name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || v.subscription_status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">👥 {t('allVendors')}</h1>
          <p className="page-subtitle">{vendors.length} vendeur{vendors.length>1?'s':''} inscrit{vendors.length>1?'s':''}</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16, padding: 14 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div className="search-input" style={{ flex: 1, minWidth: 220 }}>
            <Search className="search-icon" />
            <input className="form-input" placeholder="Rechercher vendeur, email, boutique..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
          </div>
          <select className="form-select" style={{ width: 'auto' }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">Tous</option>
            <option value="active">Actifs</option>
            <option value="trial">Essai</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>
      </div>

      {loading ? <div className="loading-screen"><div className="spinner" /></div> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Vendeur</th><th>Boutique</th><th>Contact</th><th>Ville</th><th>Abonnement</th><th>Inscrit le</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{v.full_name}</div>
                    <div className="td-muted">{v.email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{v.shop_name}</div>
                    <div className="td-muted" style={{ fontSize: 11 }}>/{v.shop_slug}</div>
                  </td>
                  <td className="td-muted">{v.phone}</td>
                  <td className="td-muted">{v.city}</td>
                  <td>
                    <span className={`badge ${v.subscription_status==='active'?'badge-success':v.subscription_status==='trial'?'badge-warning':'badge-danger'}`}>
                      {v.subscription_status==='trial'?'🎁 Essai':v.subscription_status==='active'?'✅ Actif':'❌ Inactif'}
                    </span>
                  </td>
                  <td className="td-muted">{new Date(v.created_at).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <a href={`/boutique/${v.shop_slug}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" title="Voir boutique">
                        <ExternalLink size={13} />
                      </a>
                      <button className="btn btn-secondary btn-sm" onClick={() => toggleStatus(v)} title={v.subscription_status==='active'?'Désactiver':'Activer'}>
                        {v.subscription_status==='active' ? <ToggleRight size={16} color="var(--color-success)" /> : <ToggleLeft size={16} color="var(--color-text3)" />}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(v.id)} title="Supprimer">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
