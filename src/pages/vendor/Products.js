import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Search, Package, ToggleLeft, ToggleRight, Camera, X, Image } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['clothing','food','electronics','beauty','home','jewelry','shoes','bags','other'];

/* ── Convertit un fichier en base64 ── */
const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

/* ── Composant upload photo ── */
function PhotoUploader({ images, onChange }) {
  const [previews, setPreviews] = useState(images || []);

  const handleFiles = async (files) => {
    const arr = Array.from(files).slice(0, 4 - previews.length);
    const newPreviews = [];
    for (const file of arr) {
      if (!file.type.startsWith('image/')) { toast.error('Fichier non valide'); continue; }
      if (file.size > 2 * 1024 * 1024) { toast.error('Image trop grande (max 2MB)'); continue; }
      const b64 = await fileToBase64(file);
      newPreviews.push(b64);
    }
    const all = [...previews, ...newPreviews];
    setPreviews(all);
    onChange(all);
  };

  const removeImage = (i) => {
    const all = previews.filter((_, idx) => idx !== i);
    setPreviews(all);
    onChange(all);
  };

  return (
    <div>
      {/* Grille des photos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
        {previews.map((src, i) => (
          <div key={i} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '1', background: 'var(--color-surface2)' }}>
            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button type="button" onClick={() => removeImage(i)}
              style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={12} color="white" />
            </button>
          </div>
        ))}

        {/* Bouton ajouter photo */}
        {previews.length < 4 && (
          <label style={{ aspectRatio: '1', border: '2px dashed var(--color-border)', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'var(--color-surface2)', transition: 'all 0.15s', gap: 4 }}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}>
            <Camera size={24} color="var(--color-text3)" />
            <span style={{ fontSize: 11, color: 'var(--color-text3)', fontWeight: 600 }}>Ajouter</span>
            <input type="file" accept="image/*" multiple capture="environment"
              style={{ display: 'none' }}
              onChange={e => handleFiles(e.target.files)} />
          </label>
        )}
      </div>
      <p style={{ fontSize: 11, color: 'var(--color-text3)' }}>
        📷 Prenez une photo ou sélectionnez depuis votre galerie · Max 4 photos · 2MB chacune
      </p>
    </div>
  );
}

export default function Products() {
  const { profile } = useAuth();
  const { t } = useLang();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [saving, setSaving]     = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', compare_price: '',
    stock_quantity: '', stock_alert_at: '5', category: 'other',
    images: [], is_active: true
  });

  useEffect(() => { if (profile?.id) load(); }, [profile]);

  const load = async () => {
    const { data } = await supabase.from('products').select('*').eq('vendor_id', profile.id).order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ name:'', description:'', price:'', compare_price:'', stock_quantity:'', stock_alert_at:'5', category:'other', images:[], is_active:true });
    setModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ name:p.name, description:p.description||'', price:p.price, compare_price:p.compare_price||'', stock_quantity:p.stock_quantity, stock_alert_at:p.stock_alert_at||5, category:p.category||'other', images:p.images||[], is_active:p.is_active });
    setModal(true);
  };

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return toast.error('Nom et prix requis');
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        compare_price: form.compare_price ? Number(form.compare_price) : null,
        stock_quantity: Number(form.stock_quantity) || 0,
        stock_alert_at: Number(form.stock_alert_at) || 5,
        vendor_id: profile.id
      };
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

  const fmt = n => Number(n).toLocaleString('fr-FR') + ' FCFA';
  const filtered = products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">📦 {t('products')}</h1>
          <p className="page-subtitle">{products.length} produit{products.length > 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} />{t('addProduct')}</button>
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: 14, padding: 12 }}>
        <div className="search-input">
          <Search className="search-icon" />
          <input className="form-input" placeholder="Rechercher un produit..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? <div className="loading-screen"><div className="spinner" /></div> :
        filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Package /></div>
            <h3>Aucun produit</h3>
            <p>Ajoutez vos premiers produits</p>
            <button className="btn btn-primary" onClick={openAdd}><Plus size={16} />{t('addProduct')}</button>
          </div>
        ) : (
          /* Grille produits — affichage cards sur mobile */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {filtered.map(p => (
              <div key={p.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Image */}
                <div style={{ height: 120, background: 'var(--color-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {p.images?.[0]
                    ? <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <Package size={32} color="var(--color-text3)" />
                  }
                </div>
                <div style={{ padding: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--color-primary)', marginBottom: 6 }}>{fmt(p.price)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className={`badge ${p.stock_quantity === 0 ? 'badge-danger' : p.stock_quantity <= p.stock_alert_at ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: 10 }}>
                      {p.stock_quantity === 0 ? 'Épuisé' : p.stock_quantity + ' unités'}
                    </span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '4px 6px' }} onClick={() => openEdit(p)}><Edit2 size={13} /></button>
                      <button className="btn btn-danger btn-sm" style={{ padding: '4px 6px' }} onClick={() => remove(p.id)}><Trash2 size={13} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editing ? '✏️ Modifier' : '➕ Nouveau produit'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={save}>
              <div className="modal-body">
                {/* Photos */}
                <div className="form-group">
                  <label className="form-label">📸 Photos du produit</label>
                  <PhotoUploader
                    images={form.images}
                    onChange={imgs => setForm(f => ({ ...f, images: imgs }))}
                  />
                </div>

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
                    <input name="price" type="number" inputMode="numeric" className="form-input" value={form.price} onChange={handle} placeholder="15000" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('comparePrice')}</label>
                    <input name="compare_price" type="number" inputMode="numeric" className="form-input" value={form.compare_price} onChange={handle} placeholder="20000" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('stock')}</label>
                    <input name="stock_quantity" type="number" inputMode="numeric" className="form-input" value={form.stock_quantity} onChange={handle} placeholder="50" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Alerte stock</label>
                    <input name="stock_alert_at" type="number" inputMode="numeric" className="form-input" value={form.stock_alert_at} onChange={handle} placeholder="5" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('category')}</label>
                  <select name="category" className="form-select" value={form.category} onChange={handle}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{t('categories.' + c)}</option>)}
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <label className="toggle">
                    <input type="checkbox" name="is_active" checked={form.is_active} onChange={handle} />
                    <span className="toggle-slider" />
                  </label>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{form.is_active ? '✅ Actif' : '⏸️ Inactif'}</span>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>{t('cancel')}</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? '...' : editing ? '💾 Enregistrer' : '➕ Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}