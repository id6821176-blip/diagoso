import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { supabase } from '../../lib/supabase';
import { generateSubscriptionPDF } from '../../components/vendor/InvoicePDF';
import { Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';

export default function Invoices() {
  const { profile } = useAuth();
  const { t } = useLang();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (profile?.id) load(); }, [profile]);

  const load = async () => {
    const { data } = await supabase.from('invoices').select('*').eq('vendor_id', profile.id).order('created_at', { ascending: false });
    setInvoices(data || []);
    setLoading(false);
  };

  const fmt = n => Number(n).toLocaleString('fr-FR') + ' FCFA';

  const statusBadge = (s) => {
    const map = { paid: 'badge-success', pending: 'badge-warning', overdue: 'badge-danger', cancelled: 'badge-gray' };
    const labels = { paid: '✅ Payée', pending: '⏳ En attente', overdue: '🚨 En retard', cancelled: 'Annulée' };
    return <span className={`badge ${map[s]||'badge-gray'}`}>{labels[s]||s}</span>;
  };

  const trialDaysLeft = profile?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at) - new Date()) / (1000*60*60*24)))
    : 0;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">🧾 {t('invoices')}</h1>
          <p className="page-subtitle">Historique de vos factures d'abonnement</p>
        </div>
      </div>

      {/* Subscription status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <CheckCircle size={20} color="var(--color-success)" />
            <span style={{ fontWeight: 700 }}>Statut abonnement</span>
          </div>
          <span className={`badge ${profile?.subscription_status==='active'||profile?.subscription_status==='trial'?'badge-success':'badge-danger'}`} style={{ fontSize: 13 }}>
            {profile?.subscription_status==='trial'?'🎁 Période d\'essai':profile?.subscription_status==='active'?'✅ Actif':'❌ Inactif'}
          </span>
          {profile?.subscription_status==='trial' && trialDaysLeft > 0 && (
            <p style={{ fontSize: 12, color: 'var(--color-text3)', marginTop: 8 }}>⏳ {trialDaysLeft} jours restants d'essai gratuit</p>
          )}
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--color-warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <AlertCircle size={20} color="var(--color-warning)" />
            <span style={{ fontWeight: 700 }}>Tarif mensuel</span>
          </div>
          <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-primary)' }}>10 000 FCFA</p>
          <p style={{ fontSize: 12, color: 'var(--color-text3)', marginTop: 4 }}>Facturé en fin de chaque mois</p>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--color-info)' }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>📱 Modes de paiement</div>
          <p style={{ fontSize: 13, color: 'var(--color-text2)', lineHeight: 1.8 }}>
            🟠 Orange Money<br/>🌊 Wave<br/>📱 Moov Money<br/>💵 Espèces (bureau)
          </p>
        </div>
      </div>

      {/* Invoices list */}
      <div className="card">
        <div className="card-header"><div className="card-title">📄 Mes factures</div></div>
        {loading ? <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> :
          invoices.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><FileText /></div>
              <h3>Aucune facture</h3>
              <p>Vos factures mensuelles apparaîtront ici</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>N° Facture</th><th>Période</th><th>Montant</th><th>Statut</th><th>Payée le</th><th>Action</th></tr></thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id}>
                      <td><strong style={{ color: 'var(--color-primary)' }}>{inv.invoice_number}</strong></td>
                      <td className="td-muted">
                        {new Date(inv.period_start).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                      </td>
                      <td><strong>{fmt(inv.amount)}</strong></td>
                      <td>{statusBadge(inv.status)}</td>
                      <td className="td-muted">{inv.paid_at ? new Date(inv.paid_at).toLocaleDateString('fr-FR') : '—'}</td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => generateSubscriptionPDF(inv, profile)}>
                          <Download size={14} /> PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </div>
  );
}
