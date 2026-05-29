import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, ADMIN_EMAIL } from '../lib/supabase';

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(undefined);
  const [profile, setProfile] = useState(null);

  const loadProfile = async (uid) => {
    try {
      const { data } = await supabase
        .from('profiles').select('*').eq('id', uid).single();
      setProfile(data || null);
    } catch {
      setProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      const u = session?.user || null;
      setUser(u);
      if (u) loadProfile(u.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        loadProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUp = async ({ email, password, fullName, phone, shopName }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
      const slug = shopName.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        + '-' + Date.now().toString().slice(-4);
      await supabase.from('profiles').insert({
        id: data.user.id, email,
        full_name: fullName, phone,
        shop_name: shopName, shop_slug: slug,
        role: email === ADMIN_EMAIL ? 'admin' : 'vendor',
        subscription_accepted: true,
        subscription_status: 'trial',
      });
    }
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates) => {
    const { data, error } = await supabase
      .from('profiles').update(updates).eq('id', user.id).select().single();
    if (error) throw error;
    setProfile(data);
    return data;
  };

  const loading = user === undefined;

  return (
    <AuthContext.Provider value={{
      user: user || null, profile, loading,
      isAdmin:  profile?.role === 'admin',
      isVendor: profile?.role === 'vendor',
      signIn, signUp, signOut, updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
