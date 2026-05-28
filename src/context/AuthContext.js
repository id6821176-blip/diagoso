import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Client Supabase avec clés directement ici pour éviter tout pb .env
const supabase = createClient(
  'https://flwiuhaqizjyypyxzkbn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsd2l1aGFxaXpqeXlweXh6a2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MTQ0NTgsImV4cCI6MjA5NTE5MDQ1OH0.qiq6zf7S0FC51_Lu_uM8PFZvgmwMpRUDD7pO64qZIx4'
);

export { supabase };
export const ADMIN_EMAIL = 'id6821176@gmail.com';

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(undefined); // undefined = pas encore vérifié
  const [profile, setProfile] = useState(null);

  // Charge le profil une seule fois
  const loadProfile = async (uid) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();
      setProfile(data || null);
    } catch {
      setProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Vérifier la session une seule fois au démarrage
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      const u = session?.user || null;
      setUser(u);
      if (u) loadProfile(u.id);
    });

    // Écouter les changements (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        loadProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
      // ignorer tous les autres events (TOKEN_REFRESHED etc.)
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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
      .from('profiles').update(updates)
      .eq('id', user.id).select().single();
    if (error) throw error;
    setProfile(data);
    return data;
  };

  // undefined = on ne sait pas encore (session en cours de vérification)
  // null = pas connecté
  const loading = user === undefined;

  return (
    <AuthContext.Provider value={{
      user: user || null,
      profile,
      loading,
      isAdmin:  profile?.role === 'admin',
      isVendor: profile?.role === 'vendor',
      signIn, signUp, signOut, updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
