import React from 'react';
import { useLang, THEMES } from '../../context/LangContext';
import { useAuth } from '../../context/AuthContext';
import { Bell, Palette, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({ title, onMenuClick }) {
  const { lang, setLang, theme, setTheme } = useLang();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const initials = profile?.full_name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || '??';

  return (
    <header className="header">
      <div className="header-left">
        {/* Hamburger — visible uniquement sur mobile */}
        <button className="hamburger" onClick={onMenuClick} aria-label="Menu">
          <Menu size={22} />
        </button>
        <div className="header-title">{title}</div>
      </div>

      <div className="header-actions">
        {/* Switcher langue */}
        <div style={{ display:'flex', gap:2, background:'var(--color-surface2)', borderRadius:8, padding:3 }}>
          {['fr','bm','ar'].map(l => (
            <button key={l} onClick={() => setLang(l)}
              style={{ padding:'4px 8px', fontSize:11, fontWeight:700, background: lang===l?'var(--color-primary)':'transparent', color: lang===l?'white':'var(--color-text3)', border:'none', borderRadius:6, cursor:'pointer', transition:'all 0.15s' }}>
              {l==='fr'?'FR':l==='bm'?'BM':'عر'}
            </button>
          ))}
        </div>

        {/* Thème */}
        <button className="btn btn-ghost btn-sm" onClick={() => {
          const keys = Object.keys(THEMES);
          const next = keys[(keys.indexOf(theme)+1) % keys.length];
          setTheme(next);
        }} style={{ padding:'6px 8px' }}>
          <div style={{ width:14, height:14, borderRadius:'50%', background: THEMES[theme]?.primary }} />
          <Palette size={13} />
        </button>

        {/* Notifs */}
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/notifications')} style={{ padding:'6px 8px' }}>
          <Bell size={17} />
        </button>

        {/* Avatar */}
        <div onClick={() => navigate(profile?.role==='admin'?'/admin/settings':'/settings')}
          style={{ cursor:'pointer' }}>
          <div className="user-avatar" style={{ width:32, height:32, fontSize:11 }}>{initials}</div>
        </div>
      </div>
    </header>
  );
}