import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ShoppingCart, Phone } from 'lucide-react';

export default function PublicShop() {
  const { slug } = useParams();
  const [vendor, setVendor]   = useState(null);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]  = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => { load(); }, [slug]);

  const load = async () => {
    const { data: v } = await supabase.from('profiles').select('*').eq('shop_slug', slug).single();
    if (!v) { setLoading(false); return; }
    setVendor(v);
    const { data: p } = await supabase.from('products').select('*').eq('vendor_id', v.id).eq('is_active', true).order('created_at', { ascending: false });
    setProducts(p || []);
    setLoading(false);
  };

  const fmt = n => Number(n).toLocaleString('fr-FR') + ' FCFA';

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filtered = category === 'all' ? products : products.filter(p => p.category === category);

  const orderViaWhatsApp = (product) => {
    const msg = encodeURIComponent(
      `🛍️ Bonjour *${vendor?.shop_name}* !\n\n` +
      `Je suis intéressé(e) par :\n*${product.name}*\n` +
      `💰 Prix : ${fmt(product.price)}\n\n` +
      `Je voudrais commander. Merci !`
    );
    const phone = vendor?.phone?.replace(/\D/g, '');
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  if (!vendor) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 48 }}>🏪</div>
      <h2>Boutique introuvable</h2>
      <p style={{ color: 'var(--color-text3)' }}>Ce lien ne correspond à aucune boutique active</p>
    </div>
  );

  const initials = vendor.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'DG';

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: 32 }}>

      {/* ── Header compact ── */}
      <div style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))`, padding: '16px 16px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>🏪 DIAGOSO</div>
          {vendor.phone && (
            <a href={`tel:${vendor.phone}`}
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
              <Phone size={13} /> Appeler
            </a>
          )}
        </div>
      </div>

      {/* ── Carte profil vendeur ── */}
      <div style={{ margin: '0 16px', marginTop: -32 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: '14px 16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-primary-light)', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: 'var(--color-primary)', flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {vendor.shop_name}
            </h1>
            {vendor.shop_description && (
              <p style={{ fontSize: 12, color: 'var(--color-text3)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {vendor.shop_description}
              </p>
            )}
            <p style={{ fontSize: 11, color: 'var(--color-text3)', margin: '2px 0 0' }}>📍 {vendor.city || 'Mali'}</p>
          </div>
          {vendor.phone && (
            <a href={`https://wa.me/${vendor.phone.replace(/\D/g,'')}?text=Bonjour ${vendor.shop_name} !`}
              style={{ background: '#25d366', color: 'white', borderRadius: 10, padding: '8px 12px', fontSize: 18, textDecoration: 'none', flexShrink: 0 }}>
              💬
            </a>
          )}
        </div>
      </div>

      {/* ── Contenu ── */}
      <div style={{ padding: '16px' }}>

        {/* Filtre catégories */}
        {categories.length > 1 && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 14, paddingBottom: 4 }}>
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 20, border: `1.5px solid ${category===c?'var(--color-primary)':'var(--color-border)'}`, background: category===c?'var(--color-primary)':'white', color: category===c?'white':'var(--color-text2)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                {c === 'all' ? '🛍️ Tout' : c}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700 }}>Nos produits ({filtered.length})</h2>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
            <p style={{ color: 'var(--color-text3)', fontSize: 13 }}>Aucun produit disponible</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map(p => (
              <div key={p.id} className="product-card" onClick={() => setSelected(p)}>
                <div className="product-img">
                  {p.images?.[0] ? <img src={p.images[0]} alt={p.name} /> : <span style={{ fontSize: 32 }}>📦</span>}
                </div>
                <div className="product-info">
                  <div className="product-name">{p.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                    <span className="product-price">{fmt(p.price)}</span>
                    {p.compare_price && <span className="product-compare">{fmt(p.compare_price)}</span>}
                  </div>
                  {p.stock_quantity === 0 && <span className="badge badge-danger" style={{ marginTop: 4, fontSize: 10 }}>Épuisé</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '20px 0 8px', color: 'var(--color-text3)', fontSize: 11 }}>
        Boutique créée avec <strong style={{ color: 'var(--color-primary)' }}>🏪 DIAGOSO</strong>
      </div>

      {/* Modal produit */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div style={{ position: 'relative' }}>
              <div style={{ height: 200, background: 'var(--color-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {selected.images?.[0]
                  ? <img src={selected.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 56 }}>📦</span>
                }
              </div>
              <button onClick={() => setSelected(null)}
                style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✕</button>
            </div>
            <div className="modal-body">
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>{selected.name}</h2>
              {selected.description && <p style={{ color: 'var(--color-text2)', fontSize: 13, marginBottom: 12, lineHeight: 1.6 }}>{selected.description}</p>}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 18 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-primary)' }}>{fmt(selected.price)}</span>
                {selected.compare_price && <span style={{ fontSize: 14, color: 'var(--color-text3)', textDecoration: 'line-through' }}>{fmt(selected.compare_price)}</span>}
              </div>
              {selected.stock_quantity > 0 ? (
                <button className="btn btn-primary btn-full btn-lg" onClick={() => orderViaWhatsApp(selected)}>
                  <ShoppingCart size={18} /> Commander via WhatsApp
                </button>
              ) : (
                <button className="btn btn-full btn-lg" disabled style={{ background: 'var(--color-surface2)', color: 'var(--color-text3)' }}>
                  Produit épuisé
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}