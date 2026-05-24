import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ShoppingCart, Phone, Share2 } from 'lucide-react';

export default function PublicShop() {
  const { slug } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const orderViaWhatsApp = (product) => {
    const msg = encodeURIComponent(
      `🛍️ Bonjour ! Je suis intéressé(e) par :\n\n` +
      `*${product.name}*\n` +
      `💰 Prix : ${fmt(product.price)}\n\n` +
      `Je voudrais passer une commande. Merci !`
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 48 }}>🏪</div>
      <h2>Boutique introuvable</h2>
      <p style={{ color: 'var(--color-text3)' }}>Ce lien ne correspond à aucune boutique active</p>
    </div>
  );

  const initials = vendor.full_name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || 'DG';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Banner */}
      <div style={{ height: 160, background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'repeating-linear-gradient(45deg, white 0px, white 1px, transparent 0px, transparent 50%)', backgroundSize: '20px 20px' }} />
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px' }}>
        {/* Shop header */}
        <div style={{ background: 'white', borderRadius: 16, padding: 20, marginTop: -40, marginBottom: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-primary-light)', border: '4px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: 'var(--color-primary)', flexShrink: 0, marginTop: -20 }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>{vendor.shop_name}</h1>
            {vendor.shop_description && <p style={{ fontSize: 13, color: 'var(--color-text3)', margin: '4px 0 0' }}>{vendor.shop_description}</p>}
            <p style={{ fontSize: 12, color: 'var(--color-text3)', margin: '4px 0 0' }}>📍 {vendor.city || 'Bamako, Mali'}</p>
          </div>
          {vendor.phone && (
            <a href={`tel:${vendor.phone}`} className="btn btn-primary">
              <Phone size={16} /> Appeler
            </a>
          )}
        </div>

        {/* Powered by */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text3)' }}>Boutique créée avec </span>
          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-primary)' }}>🏪 DIAGOSO</span>
        </div>

        {/* Products */}
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🛍️ Nos produits ({products.length})</h2>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
            <p style={{ color: 'var(--color-text3)' }}>Aucun produit disponible pour l'instant</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(p => (
              <div key={p.id} className="product-card" onClick={() => setSelected(p)}>
                <div className="product-img">
                  {p.images?.[0] ? <img src={p.images[0]} alt={p.name} /> : <span style={{ fontSize: 40 }}>📦</span>}
                </div>
                <div className="product-info">
                  <div className="product-name">{p.name}</div>
                  {p.description && <p style={{ fontSize: 12, color: 'var(--color-text3)', margin: '4px 0', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.description}</p>}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
                    <span className="product-price">{fmt(p.price)}</span>
                    {p.compare_price && <span className="product-compare">{fmt(p.compare_price)}</span>}
                  </div>
                  {p.stock_quantity === 0 && <span className="badge badge-danger" style={{ marginTop: 6 }}>Épuisé</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '40px 0 20px', color: 'var(--color-text3)', fontSize: 12 }}>
          <p>🏪 <strong style={{ color: 'var(--color-primary)' }}>DIAGOSO</strong> — La Maison du Commerce · Mali</p>
        </div>
      </div>

      {/* Product modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 460 }} onClick={e => e.stopPropagation()}>
            <div style={{ position: 'relative' }}>
              <div style={{ height: 220, background: 'var(--color-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px 16px 0 0', overflow: 'hidden' }}>
                {selected.images?.[0] ? <img src={selected.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 60 }}>📦</span>}
              </div>
              <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div className="modal-body">
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{selected.name}</h2>
              {selected.description && <p style={{ color: 'var(--color-text2)', fontSize: 13, marginBottom: 12, lineHeight: 1.6 }}>{selected.description}</p>}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 20 }}>
                <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-primary)' }}>{fmt(selected.price)}</span>
                {selected.compare_price && <span style={{ fontSize: 15, color: 'var(--color-text3)', textDecoration: 'line-through' }}>{fmt(selected.compare_price)}</span>}
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
