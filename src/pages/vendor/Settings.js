import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { supabase } from '../../lib/supabase';
import { User, Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { profile, updateProfile } = useAuth();
  const { t } = useLang();
  const [form, setForm] = useState({ full_name: profile?.full_name||'', phone: profile?.phone||'', city: profile?.city||'Bamako' });
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handlePw = e => setPwForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const saveProfile = async e => {
    e.preventDefault();
    setSaving(true);
    try { await updateProfile(form); toast.success(t('savedSuccess')); }
    catch { toast.error(t('error')); }
    setSaving(false);
  };

  const changePassword = async e => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) return toast.error('Les mots de passe ne correspondent pas');
    if (pwForm.newPw.length < 6) return toast.error('Minimum 6 caractères');
    setSavingPw(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pwForm.newPw });
      if (error) throw error;
      toast.success('Mot de passe changé avec succès !');
      setPwForm({ current: '', newPw: '', confirm: '' });
    } catch (err) { toast.error(err.message); }
    setSavingPw(false);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">⚙️ {t('settings')}</h1>
          <p className="page-subtitle">Gérez votre compte et vos préférences</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 800 }}>
        {/* Profile */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} color="var(--color-primary)" />
            </div>
            <div className="card-title">{t('profile')}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: 'var(--color-primary)' }}>
              {profile?.full_name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
            </div>
          </div>

          <form onSubmit={saveProfile}>
            <div className="form-group">
              <label className="form-label">{t('fullName')}</label>
              <input name="full_name" className="form-input" value={form.full_name} onChange={handle} />
            </div>
            <div className="form-group">
              <label className="form-label">{t('email')}</label>
              <input className="form-input" value={profile?.email} disabled style={{ background: 'var(--color-surface2)', cursor: 'not-allowed' }} />
              <p className="form-hint">L'email ne peut pas être modifié</p>
            </div>
            <div className="form-group">
              <label className="form-label">{t('phone')}</label>
              <input name="phone" className="form-input" value={form.phone} onChange={handle} placeholder="+223 70 00 00 00" />
            </div>
            <div className="form-group">
              <label className="form-label">Ville</label>
              <input name="city" className="form-input" value={form.city} onChange={handle} />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
              <Save size={16} />{saving ? t('loading') : t('updateProfile')}
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Password */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={18} color="#b45309" />
              </div>
              <div className="card-title">{t('changePassword')}</div>
            </div>
            <form onSubmit={changePassword}>
              <div className="form-group">
                <label className="form-label">{t('newPassword')}</label>
                <input name="newPw" type="password" className="form-input" value={pwForm.newPw} onChange={handlePw} placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label className="form-label">{t('confirmPassword')}</label>
                <input name="confirm" type="password" className="form-input" value={pwForm.confirm} onChange={handlePw} placeholder="••••••••" />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={savingPw}>
                <Lock size={16} />{savingPw ? t('loading') : t('changePassword')}
              </button>
            </form>
          </div>

          {/* Account info */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>ℹ️ Informations compte</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Rôle', value: profile?.role === 'admin' ? '👑 Administrateur' : '🏪 Vendeur' },
                { label: 'Abonnement', value: profile?.subscription_status === 'trial' ? '🎁 Essai gratuit' : profile?.subscription_status === 'active' ? '✅ Actif' : '❌ Inactif' },
                { label: 'Membre depuis', value: new Date(profile?.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--color-text3)', fontSize: 13 }}>{item.label}</span>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
