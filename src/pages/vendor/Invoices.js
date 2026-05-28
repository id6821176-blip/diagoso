import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { supabase } from '../../lib/supabase';
import { generateSubscriptionPDF } from '../../components/vendor/InvoicePDF';
import { Download, FileText, AlertCircle, CheckCircle, CreditCard, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const ORANGE_NUMBER = '+223 72 78 51 07';
const WAVE_NUMBER   = '+223 72 78 51 07';
const MONTHLY_FEE   = 5000;

export default function Invoices() {
  const { profile } = useAuth();
  const { t } = useLang();
  const [invoices, setInvoices]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [payModal, setPayModal]     = useState(null); // invoice en cours de paiement
  const [reference, setReference]   = useState('');
  const [method, setMethod]         = useState('orange_money');
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied]         = useState('');

  useEffect(() => { if (profile?.id) load(); }, [profile]);

  const load = async () => {
    const { data } = await supabase
      .from('invoices').select('*')
      .eq('vendor_id', profile.id)
      .order('created_at', { ascending: false });
    setInvoices(data || []);
    setLoading(false);
  };

  const copyNumber = (num, key) => {
    navigator.clipboard.writeText(num.replace(/\s/g, ''));
    setCopied(key);
    toast.success('Numéro copié !');
    setTimeout(() => setCopied(''), 2000);
  };

  const submitPayment = async (e) => {
    e.preventDefault();
    if (!reference.trim()) return toast.error('Entrez la référence de transaction');
    setSubmitting(true);
    try {
      await supabase.from('invoices').update({
        status: 'pending',
        payment_method: method,
        // on stocke la ref dans les notes via une colonne texte
      }).eq('id', payModal.id);

      // Créer une notification pour l'admin
      await supabase.from('notifications').insert({
        vendor_id: profile.id,
        title: 'Paiement soumis',
        message: `${profile.shop_name} a soumis un paiement de ${MONTHLY_FEE.toLocaleString()} FCFA via ${method === 'orange_money' ? 'Orange Money' : 'Wave'}. Référence : ${reference}`,
        type: 'payment',
      });

      toast.success('✅ Paiement soumis ! Confirmation sous 24h.');
      setPayModal(null);
      setReference('');
      load();
    } catch {
      toast.error('Erreur lors de la soumission');
    }
    setSubmitting(false);
  };

  const fmt = n => Number(n).toLocaleString('fr-FR') + ' FCFA';

  const statusBadge = (s) => {
    const map    = { paid:'badge-success', pending:'badge-warning', overdue:'badge-danger', cancelled:'badge-gray' };
    const labels = { paid:'✅ Payée', pending:'⏳ En attente', overdue:'🚨 En retard', cancelled:'Annulée' };
    return <span className={`badge ${map[s] || 'badge-gray'}`}>{labels[s] || s}</span>;
  };

  const trialDaysLeft = profile?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at) - new Date()) / (1000*60*60*24)))
    : 0;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">🧾 {t('invoices')}</h1>
          <p className="page-subtitle">Historique et paiement de vos factures</p>
        </div>
      </div>

      {/* Statut abonnement */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:16, marginBottom:24 }}>
        <div className="card" style={{ borderLeft:'4px solid var(--color-primary)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <CheckCircle size={20} color="var(--color-success)" />
            <span style={{ fontWeight:700 }}>Statut abonnement</span>
          </div>
          <span className={`badge ${profile?.subscription_status==='active'||profile?.subscription_status==='trial' ? 'badge-success':'badge-danger'}`} style={{ fontSize:13 }}>
            {profile?.subscription_status==='trial' ? '🎁 Période d\'essai' : profile?.subscription_status==='active' ? '✅ Actif' : '❌ Inactif'}
          </span>
          {profile?.subscription_status==='trial' && trialDaysLeft > 0 && (
            <p style={{ fontSize:12, color:'var(--color-text3)', marginTop:8 }}>⏳ {trialDaysLeft} jours restants gratuits</p>
          )}
        </div>

        <div className="card" style={{ borderLeft:'4px solid var(--color-warning)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <AlertCircle size={20} color="var(--color-warning)" />
            <span style={{ fontWeight:700 }}>Tarif mensuel</span>
          </div>
          <p style={{ fontSize:24, fontWeight:800, color:'var(--color-primary)' }}>{fmt(MONTHLY_FEE)}</p>
          <p style={{ fontSize:12, color:'var(--color-text3)', marginTop:4 }}>Facturé en fin de chaque mois</p>
        </div>

        {/* Comment payer */}
        <div className="card" style={{ borderLeft:'4px solid var(--color-info)', background:'#eff6ff' }}>
          <div style={{ fontWeight:700, marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>
            <CreditCard size={18} color="var(--color-info)" /> Comment payer
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'white', borderRadius:8, padding:'8px 12px' }}>
              <div>
                <span style={{ fontSize:13, fontWeight:700 }}>🟠 Orange Money</span>
                <div style={{ fontSize:12, color:'var(--color-text3)' }}>{ORANGE_NUMBER}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => copyNumber(ORANGE_NUMBER, 'orange')}>
                {copied==='orange' ? <Check size={14} color="var(--color-success)" /> : <Copy size={14} />}
              </button>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'white', borderRadius:8, padding:'8px 12px' }}>
              <div>
                <span style={{ fontSize:13, fontWeight:700 }}>🌊 Wave</span>
                <div style={{ fontSize:12, color:'var(--color-text3)' }}>{WAVE_NUMBER}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => copyNumber(WAVE_NUMBER, 'wave')}>
                {copied==='wave' ? <Check size={14} color="var(--color-success)" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste factures */}
      <div className="card">
        <div className="card-header"><div className="card-title">📄 Mes factures</div></div>
        {loading ? (
          <div style={{ padding:40, textAlign:'center' }}><div className="spinner" style={{ margin:'0 auto' }} /></div>
        ) : invoices.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FileText /></div>
            <h3>Aucune facture</h3>
            <p>Vos factures mensuelles apparaîtront ici</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>N° Facture</th><th>Période</th><th>Montant</th><th>Statut</th><th>Payée le</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id}>
                    <td><strong style={{ color:'var(--color-primary)' }}>{inv.invoice_number}</strong></td>
                    <td className="td-muted">
                      {new Date(inv.period_start).toLocaleDateString('fr-FR', { month:'long', year:'numeric' })}
                    </td>
                    <td><strong>{fmt(inv.amount)}</strong></td>
                    <td>{statusBadge(inv.status)}</td>
                    <td className="td-muted">{inv.paid_at ? new Date(inv.paid_at).toLocaleDateString('fr-FR') : '—'}</td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        {inv.status !== 'paid' && (
                          <button className="btn btn-sm btn-primary" onClick={() => setPayModal(inv)}>
                            <CreditCard size={13} /> Payer
                          </button>
                        )}
                        <button className="btn btn-secondary btn-sm" onClick={() => generateSubscriptionPDF(inv, profile)}>
                          <Download size={13} />
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

      {/* Modal paiement */}
      {payModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setPayModal(null)}>
          <div className="modal" style={{ maxWidth:460 }}>
            <div className="modal-header">
              <h3 className="modal-title">💳 Payer ma facture</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setPayModal(null)}>✕</button>
            </div>
            <form onSubmit={submitPayment}>
              <div className="modal-body">

                {/* Montant */}
                <div style={{ background:'var(--color-primary-light)', borderRadius:12, padding:16, textAlign:'center', marginBottom:20 }}>
                  <div style={{ fontSize:13, color:'var(--color-text3)', marginBottom:4 }}>Montant à payer</div>
                  <div style={{ fontSize:32, fontWeight:800, color:'var(--color-primary)' }}>{fmt(payModal.amount)}</div>
                  <div style={{ fontSize:12, color:'var(--color-text3)', marginTop:4 }}>
                    Période : {new Date(payModal.period_start).toLocaleDateString('fr-FR', { month:'long', year:'numeric' })}
                  </div>
                </div>

                {/* Étape 1 */}
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ background:'var(--color-primary)', color:'white', borderRadius:'50%', width:22, height:22, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, flexShrink:0 }}>1</span>
                    Choisissez votre mode de paiement
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    {[
                      { key:'orange_money', label:'Orange Money', emoji:'🟠', num: ORANGE_NUMBER },
                      { key:'wave',         label:'Wave',         emoji:'🌊', num: WAVE_NUMBER  },
                    ].map(m => (
                      <button key={m.key} type="button"
                        onClick={() => setMethod(m.key)}
                        style={{ padding:14, border:`2px solid ${method===m.key?'var(--color-primary)':'var(--color-border)'}`, borderRadius:10, background: method===m.key?'var(--color-primary-light)':'white', cursor:'pointer', textAlign:'center', transition:'all 0.15s' }}>
                        <div style={{ fontSize:24 }}>{m.emoji}</div>
                        <div style={{ fontWeight:700, fontSize:13, marginTop:4 }}>{m.label}</div>
                        <div style={{ fontSize:11, color:'var(--color-text3)', marginTop:2 }}>{m.num}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Étape 2 */}
                <div style={{ background:'#f8fafc', borderRadius:10, padding:14, marginBottom:16 }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ background:'var(--color-primary)', color:'white', borderRadius:'50%', width:22, height:22, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, flexShrink:0 }}>2</span>
                    Envoyez {fmt(payModal.amount)} à ce numéro
                  </div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'white', borderRadius:8, padding:'10px 14px', border:'1px solid var(--color-border)' }}>
                    <div>
                      <div style={{ fontSize:11, color:'var(--color-text3)' }}>{method==='orange_money'?'🟠 Orange Money':'🌊 Wave'}</div>
                      <div style={{ fontSize:18, fontWeight:800, letterSpacing:1 }}>
                        {method==='orange_money' ? ORANGE_NUMBER : WAVE_NUMBER}
                      </div>
                    </div>
                    <button type="button" className="btn btn-primary btn-sm"
                      onClick={() => copyNumber(method==='orange_money'?ORANGE_NUMBER:WAVE_NUMBER, 'modal')}>
                      {copied==='modal' ? <Check size={14} /> : <Copy size={14} />}
                      {copied==='modal' ? 'Copié !' : 'Copier'}
                    </button>
                  </div>
                  <p style={{ fontSize:11, color:'var(--color-text3)', marginTop:8 }}>
                    💡 Mentionnez <strong>"{profile?.shop_name} DIAGOSO"</strong> comme motif du transfert
                  </p>
                </div>

                {/* Étape 3 */}
                <div>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ background:'var(--color-primary)', color:'white', borderRadius:'50%', width:22, height:22, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, flexShrink:0 }}>3</span>
                    Entrez la référence de votre transaction
                  </div>
                  <input className="form-input" value={reference} onChange={e => setReference(e.target.value)}
                    placeholder="Ex: OM241201-123456 ou TXN-789..." required />
                  <p style={{ fontSize:11, color:'var(--color-text3)', marginTop:6 }}>
                    La référence se trouve dans le SMS de confirmation reçu après le paiement
                  </p>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setPayModal(null)}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Envoi...' : '✅ Confirmer le paiement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
