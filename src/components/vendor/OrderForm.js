import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../context/LangContext';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrderForm({ onClose, onSaved, vendorId }) {
  const { t } = useLang();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    customer_name: '', customer_phone: '', customer_address: '', customer_city: 'Bamako',
    payment_method: 'cash', payment_status: 'pending', delivery_fee: 0, notes: ''
  });
  const [items, setItems] = useState([{ product_id: '', product_name: '', product_price: 0, quantity: 1 }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('products').select('id,name,price').eq('vendor_id', vendorId).eq('is_active', true).then(({ data }) => setProducts(data || []));
  }, [vendorId]);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const setItem = (i, field, value) => {
    setItems(items => items.map((item, idx) => {
      if (idx !== i) return item;
      if (field === 'product_id') {
        const p = products.find(p => p.id === value);
        return { ...item, product_id: value, product_name: p?.name || '', product_price: p?.price || 0 };
      }
      return { ...item, [field]: value };
    }));
  };

  const addItem = () => setItems(i => [...i, { product_id: '', product_name: '', product_price: 0, quantity: 1 }]);
  const removeItem = i => setItems(items => items.filter((_, idx) => idx !== i));

  const subtotal = items.reduce((s, i) => s + (Number(i.product_price) * Number(i.quantity)), 0);
  const total = subtotal + Number(form.delivery_fee || 0);
  const fmt = n => Number(n).toLocaleString('fr-FR') + ' FCFA';

  const save = async e => {
    e.preventDefault();
    if (!form.customer_name || !form.customer_phone) return toast.error('Nom et téléphone client requis');
    if (items.some(i => !i.product_name || !i.product_price)) return toast.error('Vérifiez les articles');
    setSaving(true);
    try {
      const orderNumber = 'DGS-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.floor(Math.random()*9000+1000);
      const { data: order, error } = await supabase.from('orders').insert({
        ...form, vendor_id: vendorId, order_number: orderNumber,
        subtotal, total, delivery_fee: Number(form.delivery_fee||0)
      }).select().single();
      if (error) throw error;
      await supabase.from('order_items').insert(
        items.map(i => ({ order_id: order.id, product_id: i.product_id||null, product_name: i.product_name, product_price: Number(i.product_price), quantity: Number(i.quantity), subtotal: Number(i.product_price)*Number(i.quantity) }))
      );
      // decrease stock
      for (const i of items) {
        if (i.product_id) await supabase.rpc('decrement_stock', { p_id: i.product_id, qty: Number(i.quantity) }).catch(() => {});
      }
      toast.success(t('orderCreated') + ' 🎉');
      onSaved?.();
    } catch (err) { toast.error(err.message || t('error')); }
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 620 }}>
        <div className="modal-header">
          <h3 className="modal-title">🛒 {t('newOrder')}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={save}>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {/* Customer */}
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text3)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Informations client</p>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('customerName')} <span>*</span></label>
                <input name="customer_name" className="form-input" value={form.customer_name} onChange={handle} placeholder="Fatima Coulibaly" required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('customerPhone')} <span>*</span></label>
                <input name="customer_phone" className="form-input" value={form.customer_phone} onChange={handle} placeholder="+223 76 00 00 00" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('customerAddress')}</label>
                <input name="customer_address" className="form-input" value={form.customer_address} onChange={handle} placeholder="Quartier, rue..." />
              </div>
              <div className="form-group">
                <label className="form-label">Ville</label>
                <input name="customer_city" className="form-input" value={form.customer_city} onChange={handle} />
              </div>
            </div>

            {/* Items */}
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text3)', marginBottom: 12, marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Articles commandés</p>
            {items.map((item, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, marginBottom: 10, alignItems: 'end' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  {i === 0 && <label className="form-label">Produit</label>}
                  <select className="form-select" value={item.product_id}
                    onChange={e => setItem(i, 'product_id', e.target.value)}>
                    <option value="">-- Choisir --</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    <option value="custom">Produit personnalisé</option>
                  </select>
                  {item.product_id === 'custom' && (
                    <input className="form-input" style={{ marginTop: 4 }} placeholder="Nom du produit"
                      value={item.product_name} onChange={e => setItem(i, 'product_name', e.target.value)} />
                  )}
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  {i === 0 && <label className="form-label">Prix FCFA</label>}
                  <input type="number" className="form-input" value={item.product_price}
                    onChange={e => setItem(i, 'product_price', e.target.value)} placeholder="0" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  {i === 0 && <label className="form-label">{t('quantity')}</label>}
                  <input type="number" className="form-input" value={item.quantity} min="1"
                    onChange={e => setItem(i, 'quantity', e.target.value)} />
                </div>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeItem(i)} disabled={items.length === 1}
                  style={{ marginBottom: 0, height: 40 }}><Trash2 size={14} /></button>
              </div>
            ))}
            <button type="button" className="btn btn-secondary btn-sm" onClick={addItem} style={{ marginBottom: 16 }}>
              <Plus size={14} />{t('addItem')}
            </button>

            {/* Payment */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('paymentMethod')}</label>
                <select name="payment_method" className="form-select" value={form.payment_method} onChange={handle}>
                  <option value="cash">{t('cash')}</option>
                  <option value="orange_money">{t('orangeMoney')}</option>
                  <option value="wave">{t('wave')}</option>
                  <option value="moov_money">{t('moovMoney')}</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t('paymentStatus')}</label>
                <select name="payment_status" className="form-select" value={form.payment_status} onChange={handle}>
                  <option value="pending">{t('unpaid')}</option>
                  <option value="paid">{t('paid')}</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t('deliveryFee')} (FCFA)</label>
              <input name="delivery_fee" type="number" className="form-input" value={form.delivery_fee} onChange={handle} placeholder="0" />
            </div>
            <div className="form-group">
              <label className="form-label">{t('notes')}</label>
              <textarea name="notes" className="form-textarea" value={form.notes} onChange={handle} placeholder="Instructions spéciales..." style={{ minHeight: 60 }} />
            </div>

            {/* Total */}
            <div style={{ background: 'var(--color-primary-light)', borderRadius: 10, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--color-text2)', fontSize: 13 }}>{t('subtotal')}</span>
                <strong>{fmt(subtotal)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--color-text2)', fontSize: 13 }}>{t('deliveryFee')}</span>
                <strong>{fmt(form.delivery_fee||0)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-primary)', paddingTop: 8 }}>
                <span style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>{t('total')}</span>
                <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--color-primary)' }}>{fmt(total)}</span>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>{t('cancel')}</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? t('loading') : '✅ Créer la commande'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
