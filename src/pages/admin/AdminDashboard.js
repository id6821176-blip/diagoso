import React, { useEffect, useState } from 'react';
import { useLang } from '../../context/LangContext';
import { supabase } from '../../lib/supabase';
import { Users, ShoppingCart, TrendingUp, FileText, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MONTHLY_FEE = 5000;

export default function AdminDashboard() {
  const { t } = useLang();
  const [stats, setStats]     = useState({ vendors:0, active:0, orders:0, revenue:0, monthlyRevenue:0 });
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [vRes, oRes, iRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('role','vendor'),
      supabase.from('orders').select('total,payment_status,created_at'),
      supabase.from('invoices').select('amount,status,created_at')
    ]);
    const vs   = vRes.data  || [];
    const os   = oRes.data  || [];
    const invs = iRes.data  || [];
    const now  = new Date();
    const mStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const paid = invs.filter(i => i.status === 'paid');
    setStats({
      vendors: vs.length,
      active:  vs.filter(v => ['active','trial'].includes(v.subscription_status)).length,
      orders:  os.length,
      revenue: paid.reduce((s,i) => s + Number(i.amount), 0),
      monthlyRevenue: paid.filter(i => i.created_at >= mStart).reduce((s,i) => s + Number(i.amount), 0)
    });
    setVendors(vs.slice(0, 10));
    setLoading(false);
  };

  const generateMonthlyInvoices = async () => {
    const { data: vlist } = await supabase.from('profiles').select('*').eq('role','vendor').in('subscription_status',['active','trial']);
    if (!vlist?.length) return toast.error('Aucun vendeur actif');
    const now      = new Date();
    const pStart   = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const pEnd     = new Date(now.getFullYear(), now.getMonth()+1, 0).toISOString().split('T')[0];
    let created    = 0;
    for (const v of vlist) {
      const { data: ex } = await supabase.from('invoices').select('id').eq('vendor_id',v.id).eq('period_start',pStart).maybeSingle();
      if (ex) continue;
      const num = `INV-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}-${Math.floor(Math.random()*9000+1000)}`;
      const { error } = await supabase.from('invoices').insert({
        invoice_number: num, vendor_id: v.id,
        amount: MONTHLY_FEE, period_start: pStart, period_end: pEnd, status: 'pending'
      });
      if (!error) {
        created++;
        await supabase.from('notifications').insert({
          vendor_id: v.id,
          title: '🧾 Nouvelle facture disponible',
          message: `Votre facture de ${MONTHLY_FEE.toLocaleString('fr-FR')} FCFA pour ${now.toLocaleDateString('fr-FR',{month:'long',year:'numeric'})} est disponible. Merci de procéder au paiement via Orange Money ou Wave au +223 72 78 51 07.`,
          type: 'payment'
        });
      }
    }
    toast.success(`✅ ${created} facture${created>1?'s':''} de ${MONTHLY_FEE.toLocaleString('fr-FR')} FCFA générée${created>1?'s':''} !`);
    load();
  };

  const fmt = n => Number(n).toLocaleString('fr-FR') + ' FCFA';

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">👑 Administration</h1>
          <p className="page-subtitle">Vue d'ensemble — DIAGOSO</p>
        </div>
        <button className="btn btn-primary" onClick={generateMonthlyInvoices}>
          <FileText size={16} /> Générer factures
        </button>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon"><Users /></div>
          <div className="stat-label">Vendeurs</div>
          <div className="stat-value">{stats.vendors}</div>
          <div className="stat-change">{stats.active} actifs</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><CheckCircle /></div>
          <div className="stat-label">Actifs</div>
          <div className="stat-value" style={{color:'var(--color-success)'}}>{stats.active}</div>
          <div className="stat-change">En service</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><ShoppingCart /></div>
          <div className="stat-label">Commandes</div>
          <div className="stat-value">{stats.orders}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background:'#fef3c7',color:'#b45309'}}><TrendingUp /></div>
          <div className="stat-label">Revenu total</div>
          <div className="stat-value" style={{fontSize:15}}>{fmt(stats.revenue)}</div>
          <div className="stat-change">{fmt(stats.monthlyRevenue)} ce mois</div>
        </div>
      </div>

      {/* Projection */}
      <div style={{background:'linear-gradient(135deg,var(--color-primary),var(--color-primary-dark))',borderRadius:14,padding:18,marginBottom:20,color:'white'}}>
        <h3 style={{fontWeight:700,marginBottom:4,fontSize:14}}>💰 Projection revenus</h3>
        <p style={{opacity:0.8,fontSize:12,marginBottom:12}}>{stats.active} vendeurs × {fmt(MONTHLY_FEE)}/mois</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
          {[['Ce mois', stats.active*MONTHLY_FEE],['Trimestre', stats.active*MONTHLY_FEE*3],['Année', stats.active*MONTHLY_FEE*12]].map(([l,v]) => (
            <div key={l} style={{background:'rgba(255,255,255,0.15)',borderRadius:10,padding:10}}>
              <div style={{fontSize:11,opacity:0.8,marginBottom:3}}>{l}</div>
              <div style={{fontSize:14,fontWeight:800}}>{fmt(v)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Vendeurs récents */}
      <div className="card">
        <div className="card-header"><div className="card-title">🏪 Derniers vendeurs</div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Vendeur</th><th>Boutique</th><th>Abonnement</th><th>Date</th></tr></thead>
            <tbody>
              {vendors.map(v => (
                <tr key={v.id}>
                  <td><div style={{fontWeight:600}}>{v.full_name}</div><div className="td-muted">{v.email}</div></td>
                  <td>{v.shop_name}</td>
                  <td>
                    <span className={`badge ${v.subscription_status==='active'?'badge-success':v.subscription_status==='trial'?'badge-warning':'badge-danger'}`}>
                      {v.subscription_status==='trial'?'🎁 Essai':v.subscription_status==='active'?'✅ Actif':'❌ Inactif'}
                    </span>
                  </td>
                  <td className="td-muted">{new Date(v.created_at).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}