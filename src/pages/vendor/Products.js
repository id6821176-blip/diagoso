import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Search, Package, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['clothing','food','electronics','beauty','home','jewelry','shoes','bags','other'];

export default function Products() {
  const { profile } = useAuth();
  const { t } = useLang();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', description:'', price:'', compare_price:'', stock_quantity:'', stock_alert_at:'5', category:'other', images:[], is_active:true });
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (profile?.id) load(); }, [profile]);

  const load = async () => {
    const { data } = await supabase.from('products').select('*').eq('vendor_id', profile.id).order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  const openAdd = () => { setEditing(null); setForm({ name:'', description:'', price:'', compare_price:'', stock_quantity:'', stock_alert_at:'5', category:'other', images:[], is_active:true }); setModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ name:p.name, description:p.description||'', price:p.price, compare_price:p.compare_price||'', stock_quantity:p.stock_quantity, stock_alert_at:p.stock_alert_at, category:p.category||'other', images:p.images||[], is_active:p.is_active }); setModal(true); };

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return toast.error('Nom et prix requis');
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), compare_price: form.compare_price ? Number(form.compare_price) : null, stock_quantity: Number(form.stock_quantity)||0, stock_alert_at: Number(form.stock_alert_at)||5, vendor_id: profile.id };
      if (editing) {
        await supabase.from('products').update(payload).eq('id', editing.id);
        toast.success(t('savedSuccess'));
      } else {
        await supabase.from('products').insert(payload);
        toast.success(t('productAdded'));
      }
      setModal(false);
      load();
    } catch { toast.error(t('error')); }
    setSaving(false);
  };

  const remove = async (id) => {
    if (!window.confirm(t('confirmDelete'))) return;
    await supabase.from('products').delete().eq('id', id);
    toast.success(t('deletedSuccess'));
    load();
  };

  const toggleActive = async (p) => {
    await supabase.from('products').update({ is_active: !p.is_active }).eq('id', p.id);
    load();
  };

  const fmt = (n) => Number(n).toLocaleString('fr-FR') + ' FCFA';
  const filtered = products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">📦 {t('products')}</h1>
          <p className="page-subtitle">{products.length} produit{products.length > 1 ? 's' : ''} dans votre catalogue</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} />{t('addProduct')}</button>
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: 16, padding: 14 }}>
        <div className="search-input">
          <Search className="search-icon" />
          <input className="form-input" placeholder="Rechercher un produit..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>
      </div>

      {loading ? <div className="loading-screen"><div className="spinner" /></div> :
        filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Package /></div>
            <h3>Aucun produit</h3>
            <p>Commencez par ajouter vos premiers produits</p>
            <button className="btn btn-primary" onClick={openAdd}><Plus size={16} />{t('addProduct')}</button>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Produit</th><th>Prix</th><th>Stock</th><th>Catégorie</th><th>Statut</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--color-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                          {p.images?.[0] ? <img src={p.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={16} color="var(--color-text3)" />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.name}</div>
                          {p.description && <div className="td-muted" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong>{fmt(p.price)}</strong>
                      {p.compare_price && <div className="td-muted" style={{ textDecoration: 'line-through' }}>{fmt(p.compare_price)}</div>}
                    </td>
                    <td>
                      <span className={`badge ${p.stock_quantity === 0 ? 'badge-danger' : p.stock_quantity <= p.stock_alert_at ? 'badge-warning' : 'badge-success'}`}>
                        {p.stock_quantity === 0 ? t('outOfStock') : p.stock_quantity + ' unités'}
                      </span>
                    </td>
                    <td className="td-muted">{t('categories.' + p.category) || p.category}</td>
                    <td>
                      <button onClick={() => toggleActive(p)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        {p.is_active ? <ToggleRight size={24} color="var(--color-success)" /> : <ToggleLeft size={24} color="var(--color-text3)" />}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}><Edit2 size={14} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => remove(p.id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }

      {/* Modal Add/Edit */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editing ? t('editProduct') : t('addProduct')}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={save}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">{t('productName')} <span>*</span></label>
                  <input name="name" className="form-input" value={form.name} onChange={handle} placeholder="Ex: Boubou brodé" required />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('description')}</label>
                  <textarea name="description" className="form-textarea" value={form.description} onChange={handle} placeholder="Décrivez votre produit..." />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('price')} <span>*</span></label>
                    <input name="price" type="number" className="form-input" value={form.price} onChange={handle} placeholder="15000" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('comparePrice')}</label>
                    <input name="compare_price" type="number" className="form-input" value={form.compare_price} onChange={handle} placeholder="20000" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('stock')}</label>
                    <input name="stock_quantity" type="number" className="form-input" value={form.stock_quantity} onChange={handle} placeholder="50" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('stockAlert')}</label>
                    <input name="stock_alert_at" type="number" className="form-input" value={form.stock_alert_at} onChange={handle} placeholder="5" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('category')}</label>
                  <select name="category" className="form-select" value={form.category} onChange={handle}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{t('categories.' + c)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('images')} (URLs, une par ligne)</label>
                  <textarea className="form-textarea" value={form.images.join('\n')}
                    onChange={e => setForm(f => ({ ...f, images: e.target.value.split('\n').filter(Boolean) }))}
                    placeholder="https://..." style={{ minHeight: 60 }} />
                  <p className="form-hint">Collez les liens URL de vos images produit</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <label className="toggle">
                    <input type="checkbox" name="is_active" checked={form.is_active} onChange={handle} />
                    <span className="toggle-slider" />
                  </label>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{form.is_active ? t('active') : t('inactive')}</span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>{t('cancel')}</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? t('loading') : t('save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
