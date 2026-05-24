import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { UserPlus, Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const { signUp } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', fullName: '', phone: '', shopName: '' });
  const [accepted, setAccepted] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handle = (e) => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setErrors(er => ({ ...er, [e.target.name]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Nom requis';
    if (!form.shopName.trim()) e.shopName = 'Nom de boutique requis';
    if (!form.phone.trim()) e.phone = 'Téléphone requis';
    if (!form.email.trim()) e.email = 'Email requis';
    if (form.password.length < 6) e.password = 'Minimum 6 caractères';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Les mots de passe ne correspondent pas';
    if (!accepted) e.accepted = 'Vous devez accepter les conditions';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signUp(form);
      toast.success('Compte créé ! Bienvenue sur DIAGOSO 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 500 }}>
        <div className="auth-logo">
          <div className="auth-logo-text">🏪 DIAGOSO</div>
          <div className="auth-logo-sub">La Maison du Commerce — Mali</div>
        </div>
        <h2 className="auth-title">{t('register')}</h2>
        <p className="auth-subtitle">Créez votre boutique en ligne gratuitement pendant 30 jours</p>

        {/* Subscription box */}
        <div className="subscription-box">
          <h3>💳 {t('subscriptionTitle')}</h3>
          <p>{t('subscriptionDesc')}</p>
          <label className="subscription-accept">
            <input type="checkbox" checked={accepted} onChange={e => { setAccepted(e.target.checked); setErrors(er => ({ ...er, accepted: '' })); }} />
            <span>✅ {t('subscriptionAccept')}</span>
          </label>
          {errors.accepted && <p className="form-error">{errors.accepted}</p>}
        </div>

        <form onSubmit={submit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('fullName')} <span>*</span></label>
              <input name="fullName" className="form-input" placeholder="Amadou Diallo" value={form.fullName} onChange={handle} />
              {errors.fullName && <p className="form-error">{errors.fullName}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">{t('phone')} <span>*</span></label>
              <input name="phone" className="form-input" placeholder="+223 70 00 00 00" value={form.phone} onChange={handle} />
              {errors.phone && <p className="form-error">{errors.phone}</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('shopName')} <span>*</span></label>
            <input name="shopName" className="form-input" placeholder="Ma Boutique Bamako" value={form.shopName} onChange={handle} />
            {errors.shopName && <p className="form-error">{errors.shopName}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">{t('email')} <span>*</span></label>
            <input name="email" type="email" className="form-input" placeholder="vous@email.com" value={form.email} onChange={handle} />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('password')} <span>*</span></label>
              <div style={{ position: 'relative' }}>
                <input name="password" type={showPwd ? 'text' : 'password'} className="form-input"
                  placeholder="••••••••" value={form.password} onChange={handle} style={{ paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text3)' }}>
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">{t('confirmPassword')} <span>*</span></label>
              <input name="confirmPassword" type="password" className="form-input"
                placeholder="••••••••" value={form.confirmPassword} onChange={handle} />
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading || !accepted}>
            <UserPlus size={18} />
            {loading ? t('loading') : 'Créer mon compte — 30 jours gratuits'}
          </button>
        </form>

        <hr className="divider" />
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-text3)' }}>
          {t('alreadyAccount')}{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{t('login')}</Link>
        </p>
      </div>
    </div>
  );
}
