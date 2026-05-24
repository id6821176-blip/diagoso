import React, { createContext, useContext, useState, useEffect } from 'react';
import { getT } from '../i18n/translations';
import { useAuth } from './AuthContext';

const LangContext = createContext({});
export const useLang = () => useContext(LangContext);

export const THEMES = {
  green:  { primary: '#16a34a', light: '#dcfce7', dark: '#14532d', accent: '#22c55e', name: 'Vert (Mali)' },
  orange: { primary: '#ea580c', light: '#ffedd5', dark: '#7c2d12', accent: '#f97316', name: 'Orange' },
  blue:   { primary: '#1d4ed8', light: '#dbeafe', dark: '#1e3a8a', accent: '#3b82f6', name: 'Bleu' },
  gold:   { primary: '#b45309', light: '#fef3c7', dark: '#78350f', accent: '#f59e0b', name: 'Or (Sahel)' },
  purple: { primary: '#7c3aed', light: '#ede9fe', dark: '#4c1d95', accent: '#8b5cf6', name: 'Violet' },
};

export const LangProvider = ({ children }) => {
  const { profile, updateProfile } = useAuth();
  const [lang, setLangState] = useState(profile?.language || localStorage.getItem('diagoso_lang') || 'fr');
  const [theme, setThemeState] = useState(profile?.theme || localStorage.getItem('diagoso_theme') || 'green');

  useEffect(() => {
    if (profile) {
      if (profile.language) setLangState(profile.language);
      if (profile.theme) setThemeState(profile.theme);
    }
  }, [profile]);

  useEffect(() => {
    const t = THEMES[theme] || THEMES.green;
    const root = document.documentElement;
    root.style.setProperty('--color-primary', t.primary);
    root.style.setProperty('--color-primary-light', t.light);
    root.style.setProperty('--color-primary-dark', t.dark);
    root.style.setProperty('--color-accent', t.accent);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    root.setAttribute('lang', lang);
    localStorage.setItem('diagoso_theme', theme);
  }, [theme, lang]);

  const setLang = async (l) => {
    setLangState(l);
    localStorage.setItem('diagoso_lang', l);
    if (profile) { try { await updateProfile({ language: l }); } catch {} }
  };

  const setTheme = async (t) => {
    setThemeState(t);
    if (profile) { try { await updateProfile({ theme: t }); } catch {} }
  };

  const t = getT(lang);
  const isRTL = lang === 'ar';

  return (
    <LangContext.Provider value={{ lang, theme, setLang, setTheme, t, isRTL, THEMES }}>
      {children}
    </LangContext.Provider>
  );
};
