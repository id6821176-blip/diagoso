import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { supabase } from '../../lib/supabase';
import { generateOrderPDF } from '../../components/vendor/InvoicePDF';
import { ArrowLeft, Download, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrderDetail() {
  const { id } = useParams();
  const { profile } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [id]);

  const load = async () => {
    const { data: o } = await supabase.from('orders').select('*').eq('id', id).single();
    const { data: i } = await supabase.from('order_items').select('*').eq('order_id', id);
    setOrder(o); setItems(i || []);
    setLoading(false);
  };

  const updateField = async (field, value) => {
    await supabase.from('orders').update({ [field]: value }).eq('id', id);
    setOrder(o => ({ ...o, [field]: value }));
    toast.success('Mis à jour');
  };

  const sendWhatsApp = () => {
    if (!order) return;
    const statusLabels = { pending: 'en attente', confirmed: 'confirmée', processing: 'en cours de traitement', shipped: 'expédiée', delivered: 'livrée', cancelled: 'annulée' };
    const msg = encodeURIComponent(
      `🏪 *DIAGOSO - ${profile?.shop_name}*\n\n` +
      `Bonjour *${order.customer_name}* 👋\n\n` +
      `Votre commande *${order.order_number}* est ${statusLabels[order.status] || order.status}.\n\n` +
      `💰 Total: *${Number(order.total).toLocaleString('fr-FR')} FCFA*\n\n` +
      `Merci de votre confiance ! 🙏`
    );
    window.open(`https://wa.me/${order.customer_phone.replace(/\D/g,'')}?text=${msg}`, '_blank');
  };

  const fmt = n => Number(n).toLocaleString('fr-FR') + ' FCFA';

  const statusMap = { pending: 'badge-warning', confirmed: 'badge-info', processing: 'badge-info', shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-danger' };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!order) return <div className="page-content"><p>Commande introuvable</p></div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/orders')}><ArrowLeft size={18} /></button>
          <div>
            <h1 className="page-title">{order.order_number}</h1>
            <p className="page-subtitle">Créée le {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={sendWhatsApp}><MessageCircle size={16} /> WhatsApp</button>
          <button className="btn btn-primary" onClick={() => generateOrderPDF(order, items, profile)}><Download size={16} /> {t('generateInvoice')}</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Items */}
          <div className="card">
            <div className="card-header"><div className="card-title">📦 Articles commandés</div></div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Produit</th><th>Prix</th><th>Qté</th><th>Total</th></tr></thead>
                <tbody>
                  {items.map(i => (
                    <tr key={i.id}>
                      <td style={{ fontWeight: 600 }}>{i.product_name}</td>
                      <td>{fmt(i.product_price)}</td>
                      <td>{i.quantity}</td>
                      <td><strong>{fmt(i.subtotal)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: 'var(--color-text2)', fontSize: 13 }}>
                <span>{t('subtotal')}</span><span>{fmt(order.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: 'var(--color-text2)', fontSize: 13 }}>
                <span>{t('deliveryFee')}</span><span>{fmt(order.delivery_fee||0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: 10 }}>
                <span style={{ fontWeight: 800, fontSize: 15 }}>{t('total')}</span>
                <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--color-primary)' }}>{fmt(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="card">
              <div className="card-title" style={{ marginBottom: 8 }}>📝 {t('notes')}</div>
              <p style={{ fontSize: 13, color: 'var(--color-text2)' }}>{order.notes}</p>
            </div>
          )}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Customer */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>👤 {t('customer')}</div>
            <p style={{ fontWeight: 700, fontSize: 14 }}>{order.customer_name}</p>
            <p style={{ color: 'var(--color-text3)', fontSize: 13 }}>{order.customer_phone}</p>
            {order.customer_address && <p style={{ color: 'var(--color-text3)', fontSize: 13 }}>{order.customer_address}</p>}
            <p style={{ color: 'var(--color-text3)', fontSize: 13 }}>{order.customer_city}</p>
          </div>

          {/* Status */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>📋 {t('orderStatus')}</div>
            <select className="form-select" value={order.status} onChange={e => updateField('status', e.target.value)} style={{ marginBottom: 12 }}>
              {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s =>
                <option key={s} value={s}>{t(s)}</option>
              )}
            </select>
            <div className="card-title" style={{ marginBottom: 8 }}>{t('paymentStatus')}</div>
            <select className="form-select" value={order.payment_status} onChange={e => updateField('payment_status', e.target.value)}>
              <option value="pending">{t('unpaid')}</option>
              <option value="paid">{t('paid')}</option>
            </select>
          </div>

          {/* Payment method */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 8 }}>{t('paymentMethod')}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>{order.payment_method==='cash'?'💵':order.payment_method==='orange_money'?'🟠':order.payment_method==='wave'?'🌊':'📱'}</span>
              <span style={{ fontWeight: 600 }}>{{ cash:'Espèces', orange_money:'Orange Money', wave:'Wave', moov_money:'Moov Money' }[order.payment_method]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
