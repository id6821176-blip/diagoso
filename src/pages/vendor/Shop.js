import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, ExternalLink, Share2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Shop() {
  const { profile, updateProfile } = useAuth();
  const { t, theme, setTheme, lang, setLang, THEMES } = useLang();
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ shop_name: profile?.shop_name||'', shop_description: profile?.shop_description||'' });
  const [saving, setSaving] = useState(false);

  const shopUrl = `${window.location.origin}/boutique/${profile?.shop_slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shopUrl);
    setCopied(true);
    toast.success(t('linkCopied'));
    setTimeout(() => setCopied(false), 2000);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await updateProfile(form); toast.success(t('savedSuccess')); }
    catch { toast.error(t('error')); }
    setSaving(false);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">🏪 {t('shop')}</h1>
          <p className="page-subtitle">Gérez votre boutique et partagez-la avec vos clients</p>
        </div>
        <a href={shopUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
          <ExternalLink size={16} /> Voir ma boutique
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Share */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>🔗 {t('shareShop')}</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input className="form-input" value={shopUrl} readOnly style={{ flex: 1, background: 'var(--color-surface2)', cursor: 'text', fontSize: 12 }} />
              <button className="btn btn-primary" onClick={copyLink}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copié !' : t('copyLink')}
              </button>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href={`https://wa.me/?text=${encodeURIComponent('Visitez ma boutique DIAGOSO : ' + shopUrl)}`} target="_blank" rel="noreferrer"
                className="btn btn-secondary btn-sm">🟢 Partager sur WhatsApp</a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shopUrl)}`} target="_blank" rel="noreferrer"
                className="btn btn-secondary btn-sm">🔵 Partager sur Facebook</a>
            </div>
          </div>

          {/* Shop info */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>✏️ {t('shopInfo')}</div>
            <form onSubmit={save}>
              <div className="form-group">
                <label className="form-label">{t('shopName')}</label>
                <input className="form-input" value={form.shop_name} onChange={e => setForm(f => ({ ...f, shop_name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Description de la boutique</label>
                <textarea className="form-textarea" value={form.shop_description} onChange={e => setForm(f => ({ ...f, shop_description: e.target.value }))} placeholder="Décrivez votre boutique en quelques mots..." />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? t('loading') : t('save')}</button>
            </form>
          </div>

          {/* Theme */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>🎨 {t('theme')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
              {Object.entries(THEMES).map(([key, val]) => (
                <button key={key} onClick={() => setTheme(key)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: 10, border: `2px solid ${theme===key?val.primary:'var(--color-border)'}`, borderRadius: 10, background: theme===key?val.light:'white', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: val.primary }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: theme===key?val.primary:'var(--color-text3)' }}>{val.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>🌍 {t('language')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[{code:'fr', label:'🇫🇷 Français'}, {code:'bm', label:'🇲🇱 Bambara'}, {code:'ar', label:'🇸🇦 Arabe'}].map(l => (
                <button key={l.code} onClick={() => setLang(l.code)}
                  style={{ padding: '10px 12px', border: `2px solid ${lang===l.code?'var(--color-primary)':'var(--color-border)'}`, borderRadius: 10, background: lang===l.code?'var(--color-primary-light)':'white', cursor: 'pointer', fontWeight: lang===l.code?700:500, color: lang===l.code?'var(--color-primary)':'var(--color-text2)', fontSize: 13, transition: 'all 0.15s' }}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="card-title" style={{ marginBottom: 14 }}>📱 {t('qrCode')}</div>
            <div style={{ display: 'inline-block', padding: 16, background: 'white', borderRadius: 12, border: '2px solid var(--color-border)' }}>
              <QRCodeSVG value={shopUrl} size={200} fgColor="var(--color-primary-dark)" level="H" />
            </div>
            <p style={{ marginTop: 12, fontSize: 12, color: 'var(--color-text3)' }}>Vos clients scannent ce QR code pour accéder à votre boutique</p>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={() => {
              const svg = document.querySelector('.qr-wrapper svg');
              // trigger print as workaround to save QR
              window.print();
            }}>⬇️ Télécharger le QR code</button>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 10 }}>📊 Statistiques boutique</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ color: 'var(--color-text2)', fontSize: 13 }}>Lien de la boutique</span>
              <span className="badge badge-success">Actif</span>
            </div>
            <div style={{ padding: '10px 0' }}>
              <p style={{ fontSize: 12, color: 'var(--color-text3)' }}>Partagez votre boutique sur WhatsApp, Facebook et Instagram pour attirer plus de clients !</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
