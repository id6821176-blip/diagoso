import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Bell, Check, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Notifications() {
  const { profile } = useAuth();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (profile?.id) load(); }, [profile]);

  const load = async () => {
    const { data } = await supabase.from('notifications').select('*').eq('vendor_id', profile.id).order('created_at', { ascending: false });
    setNotifs(data || []);
    setLoading(false);
  };

  const markRead = async (id) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    load();
  };

  const markAllRead = async () => {
    await supabase.from('notifications').update({ is_read: true }).eq('vendor_id', profile.id);
    toast.success('Toutes les notifications lues');
    load();
  };

  const remove = async (id) => {
    await supabase.from('notifications').delete().eq('id', id);
    load();
  };

  const typeIcon = (type) => ({ info:'ℹ️', success:'✅', warning:'⚠️', error:'❌', order:'🛒', payment:'💳' }[type] || 'ℹ️');
  const unread = notifs.filter(n => !n.is_read).length;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">🔔 Notifications</h1>
          <p className="page-subtitle">{unread} non lue{unread>1?'s':''}</p>
        </div>
        {unread > 0 && <button className="btn btn-secondary" onClick={markAllRead}><Check size={16} /> Tout marquer comme lu</button>}
      </div>

      {loading ? <div className="loading-screen"><div className="spinner" /></div> :
        notifs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Bell /></div>
            <h3>Aucune notification</h3>
            <p>Vous êtes à jour !</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {notifs.map(n => (
              <div key={n.id} style={{ background: n.is_read ? 'var(--color-surface)' : 'var(--color-primary-light)', border: `1px solid ${n.is_read ? 'var(--color-border)' : 'var(--color-accent)'}`, borderRadius: 12, padding: 16, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{typeIcon(n.type)}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: n.is_read ? 500 : 700, fontSize: 14 }}>{n.title}</div>
                  <p style={{ color: 'var(--color-text2)', fontSize: 13, marginTop: 2 }}>{n.message}</p>
                  <p style={{ color: 'var(--color-text3)', fontSize: 11, marginTop: 6 }}>{new Date(n.created_at).toLocaleString('fr-FR')}</p>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {!n.is_read && <button className="btn btn-secondary btn-sm" onClick={() => markRead(n.id)}><Check size={13} /></button>}
                  <button className="btn btn-danger btn-sm" onClick={() => remove(n.id)}><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
