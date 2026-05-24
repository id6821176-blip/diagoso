import React from 'react';
import { useLang, THEMES } from '../../context/LangContext';
import { useAuth } from '../../context/AuthContext';
import { Bell, Globe, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({ title }) {
  const { lang, setLang, theme, setTheme, THEMES: themes } = useLang();
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="header">
      <div style={{ paddingLeft: 48 }}>
        <div className="header-title">{title}</div>
      </div>
      <div className="header-actions">

        {/* Language switcher */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--color-surface2)', borderRadius: 8, padding: 3 }}>
          {['fr', 'bm', 'ar'].map(l => (
            <button key={l} onClick={() => setLang(l)} className="btn btn-sm"
              style={{ padding: '4px 10px', fontSize: 11, fontWeight: 700, background: lang === l ? 'var(--color-primary)' : 'transparent', color: lang === l ? 'white' : 'var(--color-text3)', border: 'none', borderRadius: 6 }}>
              {l === 'fr' ? 'FR' : l === 'bm' ? 'BM' : 'عر'}
            </button>
          ))}
        </div>

        {/* Theme switcher */}
        <div style={{ position: 'relative' }} className="theme-picker">
          <button className="btn btn-ghost btn-sm" title="Changer le thème"
            onClick={() => {
              const keys = Object.keys(themes);
              const next = keys[(keys.indexOf(theme) + 1) % keys.length];
              setTheme(next);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: THEMES[theme]?.primary }} />
            <Palette size={14} />
          </button>
        </div>

        {/* Notifications */}
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/notifications')}>
          <Bell size={18} />
        </button>

        {/* User */}
        <div onClick={() => navigate(profile?.role === 'admin' ? '/admin/settings' : '/settings')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="user-avatar" style={{ width: 32, height: 32, fontSize: 11 }}>
            {profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
        </div>
      </div>
    </header>
  );
}
