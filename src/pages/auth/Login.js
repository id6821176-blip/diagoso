import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { signIn } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Remplissez tous les champs');
    setLoading(true);
    try {
      const { user } = await signIn(form);
      // redirect based on role — profile loads async, check email
      const adminEmail = 'id6821176@gmail.com';
      navigate(form.email === adminEmail ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-text">🏪 DIAGOSO</div>
          <div className="auth-logo-sub">La Maison du Commerce — Mali</div>
        </div>
        <h2 className="auth-title">{t('login')}</h2>
        <p className="auth-subtitle">Accédez à votre espace vendeur</p>

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">{t('email')}</label>
            <input name="email" type="email" className="form-input" placeholder="vendeur@email.com"
              value={form.email} onChange={handle} autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label">{t('password')}</label>
            <div style={{ position: 'relative' }}>
              <input name="password" type={showPwd ? 'text' : 'password'} className="form-input"
                placeholder="••••••••" value={form.password} onChange={handle} style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text3)' }}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            <LogIn size={18} />
            {loading ? t('loading') : t('login')}
          </button>
        </form>

        <hr className="divider" />
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-text3)' }}>
          {t('noAccount')}{' '}
          <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{t('register')}</Link>
        </p>
      </div>
    </div>
  );
}
