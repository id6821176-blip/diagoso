import React, { useState, useEffect } from 'react';

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const toggleFaq = (index) => {
    const allQ = document.querySelectorAll('.faq-q');
    const allA = document.querySelectorAll('.faq-a');
    const isOpen = allQ[index]?.classList.contains('open');
    allQ.forEach(q => q.classList.remove('open'));
    allA.forEach(a => a.classList.remove('open'));
    if (!isOpen) { allQ[index]?.classList.add('open'); allA[index]?.classList.add('open'); }
  };

  const navLinks = [
    { href: '#fonctionnalites', label: 'Fonctionnalités' },
    { href: '#comment',         label: 'Comment ça marche' },
    { href: '#prix',            label: 'Tarifs' },
    { href: '#faq',             label: 'FAQ' },
  ];

  return (
    <>
      <style>{`
        .lp*{box-sizing:border-box;margin:0;padding:0}
        .lp{font-family:'Sora',sans-serif;background:#f9fafb;color:#0a0f0a;overflow-x:hidden}

        /* ── NAV ── */
        .lp-nav{position:fixed;top:0;left:0;right:0;z-index:1000;background:rgba(255,255,255,0.96);backdrop-filter:blur(16px);border-bottom:1px solid #e5e7eb;padding:0 20px;height:60px;display:flex;align-items:center;justify-content:space-between}
        .lp-logo{font-size:19px;font-weight:800;color:#16a34a;letter-spacing:-0.5px;text-decoration:none}
        .lp-logo span{color:#d97706}

        /* Desktop links */
        .lp-nav-desktop{display:flex;align-items:center;gap:4px}
        .lp-nav-desktop a{font-size:13px;font-weight:600;color:#374151;text-decoration:none;padding:7px 12px;border-radius:8px;transition:all 0.15s;white-space:nowrap}
        .lp-nav-desktop a:hover{background:#dcfce7;color:#16a34a}
        .lp-nav-actions{display:flex;align-items:center;gap:8px}
        .lp-btn-login{display:flex;align-items:center;gap:6px;background:#f3f4f6;color:#374151;border:1.5px solid #e5e7eb;border-radius:10px;padding:8px 14px;font-size:13px;font-weight:700;font-family:'Sora',sans-serif;text-decoration:none;transition:all 0.15s;white-space:nowrap}
        .lp-btn-login:hover{background:#dcfce7;border-color:#16a34a;color:#16a34a}
        .lp-btn-login svg{width:15px;height:15px}
        .lp-btn-register{background:#d97706;color:white;border-radius:10px;padding:8px 16px;font-size:13px;font-weight:700;font-family:'Sora',sans-serif;text-decoration:none;transition:all 0.15s;white-space:nowrap;border:none}
        .lp-btn-register:hover{background:#b45309}

        /* Hamburger */
        .lp-hamburger{display:none;background:none;border:none;cursor:pointer;padding:6px;border-radius:8px;color:#374151;flex-direction:column;gap:4px;align-items:center;justify-content:center}
        .lp-hamburger span{display:block;width:22px;height:2px;background:#374151;border-radius:2px;transition:all 0.25s}
        .lp-hamburger.open span:nth-child(1){transform:translateY(6px) rotate(45deg)}
        .lp-hamburger.open span:nth-child(2){opacity:0;transform:scaleX(0)}
        .lp-hamburger.open span:nth-child(3){transform:translateY(-6px) rotate(-45deg)}

        /* Mobile menu */
        .lp-mobile-menu{display:none;position:fixed;top:60px;left:0;right:0;background:white;border-bottom:1px solid #e5e7eb;z-index:999;flex-direction:column;padding:8px 0 16px;box-shadow:0 8px 24px rgba(0,0,0,0.08);animation:slideDown 0.2s ease}
        .lp-mobile-menu.open{display:flex}
        .lp-mobile-menu a{font-size:15px;font-weight:600;color:#374151;text-decoration:none;padding:12px 24px;transition:background 0.15s}
        .lp-mobile-menu a:hover{background:#f3f4f6;color:#16a34a}
        .lp-mobile-divider{height:1px;background:#f3f4f6;margin:8px 0}
        .lp-mobile-actions{display:flex;gap:10px;padding:8px 20px 0}
        .lp-mobile-login{flex:1;text-align:center;padding:11px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:14px;font-weight:700;color:#374151;text-decoration:none;background:#f9fafb;font-family:'Sora',sans-serif}
        .lp-mobile-register{flex:1;text-align:center;padding:11px;background:#16a34a;border-radius:10px;font-size:14px;font-weight:700;color:white;text-decoration:none;font-family:'Sora',sans-serif}

        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}

        /* Overlay */
        .lp-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.3);z-index:998}
        .lp-overlay.open{display:block}

        /* ── HERO ── */
        .lp-hero{min-height:100vh;padding:90px 20px 60px;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#f0fdf4 0%,#fff 50%,#fefce8 100%);position:relative;overflow:hidden}
        .lp-hero-bg{position:absolute;inset:0;background-image:radial-gradient(circle at 20% 20%,rgba(22,163,74,0.08) 0%,transparent 50%),radial-gradient(circle at 80% 80%,rgba(217,119,6,0.08) 0%,transparent 50%);pointer-events:none}
        .lp-hero-content{max-width:680px;text-align:center;position:relative;z-index:2;animation:lpFadeUp 0.8s ease both}
        .lp-badge{display:inline-flex;align-items:center;gap:8px;background:#dcfce7;color:#16a34a;border:1px solid rgba(22,163,74,0.3);border-radius:40px;padding:7px 16px;font-size:12px;font-weight:700;margin-bottom:24px}
        .lp-h1{font-size:clamp(32px,6vw,62px);font-weight:800;line-height:1.1;letter-spacing:-2px;margin-bottom:20px}
        .lp-h1 .green{color:#16a34a}
        .lp-h1 .gold{color:#d97706}
        .lp-sub{font-size:clamp(15px,2vw,18px);color:#374151;max-width:540px;margin:0 auto 32px;line-height:1.7}
        .lp-cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
        .lp-btn-primary{background:#16a34a;color:white;padding:14px 28px;border-radius:12px;font-size:14px;font-weight:700;font-family:'Sora',sans-serif;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:all 0.2s;box-shadow:0 4px 20px rgba(22,163,74,0.35)}
        .lp-btn-primary:hover{background:#14532d;transform:translateY(-2px)}
        .lp-btn-outline{background:white;color:#0a0f0a;padding:14px 28px;border-radius:12px;font-size:14px;font-weight:700;font-family:'Sora',sans-serif;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:all 0.2s;border:1.5px solid #e5e7eb}
        .lp-btn-outline:hover{border-color:#16a34a;color:#16a34a;transform:translateY(-2px)}
        .lp-proof{margin-top:40px;display:flex;align-items:center;justify-content:center;gap:20px;flex-wrap:wrap}
        .lp-proof-item{display:flex;align-items:center;gap:6px;font-size:12px;color:#6b7280;font-weight:600}
        .lp-proof-dot{width:6px;height:6px;border-radius:50%;background:#16a34a;flex-shrink:0}

        /* ── STATS ── */
        .lp-stats{background:#16a34a;padding:24px;display:grid;grid-template-columns:repeat(4,1fr);text-align:center}
        .lp-stat-num{font-size:clamp(20px,4vw,34px);font-weight:800;color:white;letter-spacing:-1px}
        .lp-stat-label{font-size:11px;color:rgba(255,255,255,0.75);font-weight:600;margin-top:3px;text-transform:uppercase;letter-spacing:0.5px}

        /* ── SECTIONS ── */
        .lp-section{padding:70px 20px}
        .lp-container{max-width:1100px;margin:0 auto}
        .lp-section-badge{display:inline-flex;align-items:center;background:#dcfce7;color:#16a34a;border-radius:40px;padding:5px 14px;font-size:11px;font-weight:700;margin-bottom:14px;text-transform:uppercase;letter-spacing:0.5px}
        .lp-section-title{font-size:clamp(24px,4vw,40px);font-weight:800;letter-spacing:-1px;line-height:1.2;margin-bottom:14px}
        .lp-section-sub{font-size:15px;color:#374151;max-width:540px;line-height:1.7}

        /* ── PROBLEMS ── */
        .lp-problems{background:#0a0f0a}
        .lp-problems-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2px;margin-top:40px;border-radius:16px;overflow:hidden}
        .lp-problem-card{background:#111;padding:24px;transition:background 0.2s}
        .lp-problem-card:hover{background:#161b16}
        .lp-problem-icon{font-size:26px;margin-bottom:12px}
        .lp-problem-title{font-size:14px;font-weight:700;color:white;margin-bottom:6px}
        .lp-problem-desc{font-size:12px;color:rgba(255,255,255,0.5);line-height:1.6}
        .lp-problem-arrow{color:#4ade80;font-size:12px;font-weight:700;margin-top:10px;display:block}

        /* ── FEATURES ── */
        .lp-features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-top:40px}
        .lp-feature-card{border:1.5px solid #e5e7eb;border-radius:14px;padding:24px;transition:all 0.2s}
        .lp-feature-card:hover{border-color:#16a34a;transform:translateY(-3px);box-shadow:0 4px 20px rgba(0,0,0,0.07)}
        .lp-feature-icon{width:48px;height:48px;border-radius:12px;background:#dcfce7;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:14px}
        .lp-feature-title{font-size:15px;font-weight:700;margin-bottom:6px}
        .lp-feature-desc{font-size:13px;color:#374151;line-height:1.7}

        /* ── STEPS ── */
        .lp-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:24px;margin-top:40px}
        .lp-step{text-align:center;padding:0 12px}
        .lp-step-num{width:64px;height:64px;border-radius:50%;background:white;border:3px solid #16a34a;display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 16px;box-shadow:0 4px 14px rgba(22,163,74,0.2)}
        .lp-step-title{font-size:14px;font-weight:700;margin-bottom:6px}
        .lp-step-desc{font-size:12px;color:#6b7280;line-height:1.6}

        /* ── PRICING ── */
        .lp-pricing-card{max-width:460px;margin:40px auto 0;border:2.5px solid #16a34a;border-radius:22px;overflow:hidden;box-shadow:0 16px 48px rgba(22,163,74,0.15)}
        .lp-pricing-top{background:#16a34a;padding:32px 36px;text-align:center}
        .lp-pricing-badge{display:inline-block;background:#d97706;color:white;font-size:11px;font-weight:800;padding:3px 12px;border-radius:40px;margin-bottom:14px;text-transform:uppercase;letter-spacing:1px}
        .lp-pricing-name{font-size:20px;font-weight:800;color:white;margin-bottom:6px}
        .lp-pricing-price{font-size:48px;font-weight:800;color:white;letter-spacing:-2px;line-height:1}
        .lp-pricing-price span{font-size:16px;font-weight:600;opacity:0.8}
        .lp-pricing-trial{font-size:12px;color:rgba(255,255,255,0.8);margin-top:6px;font-weight:600}
        .lp-pricing-body{padding:28px 36px;background:white}
        .lp-pricing-features{list-style:none;display:flex;flex-direction:column;gap:12px;margin-bottom:24px}
        .lp-pricing-features li{display:flex;align-items:center;gap:10px;font-size:13px;color:#374151;font-weight:500}
        .lp-pricing-features li::before{content:'✅';font-size:15px;flex-shrink:0}
        .lp-pricing-cta{width:100%;padding:14px;background:#16a34a;color:white;border:none;border-radius:12px;font-size:15px;font-weight:700;font-family:'Sora',sans-serif;cursor:pointer;text-decoration:none;display:block;text-align:center;transition:all 0.2s}
        .lp-pricing-cta:hover{background:#14532d;transform:translateY(-2px)}
        .lp-pricing-note{text-align:center;font-size:11px;color:#6b7280;margin-top:10px}

        /* ── TESTIMONIALS ── */
        .lp-testi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin-top:40px}
        .lp-testi-card{background:white;border-radius:14px;padding:24px;border:1px solid #e5e7eb;transition:all 0.2s}
        .lp-testi-card:hover{box-shadow:0 4px 20px rgba(0,0,0,0.07);transform:translateY(-2px)}
        .lp-testi-stars{color:#d97706;font-size:16px;margin-bottom:12px}
        .lp-testi-text{font-size:13px;color:#374151;line-height:1.7;margin-bottom:18px;font-style:italic}
        .lp-testi-author{display:flex;align-items:center;gap:10px}
        .lp-testi-avatar{width:40px;height:40px;border-radius:50%;background:#dcfce7;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;color:#16a34a;flex-shrink:0}
        .lp-testi-name{font-weight:700;font-size:13px}
        .lp-testi-role{font-size:11px;color:#6b7280}

        /* ── LANGUAGES ── */
        .lp-langs{background:#0a0f0a;padding:50px 20px;text-align:center}
        .lp-langs h2{font-size:24px;font-weight:800;color:white;margin-bottom:8px}
        .lp-langs p{color:rgba(255,255,255,0.5);font-size:14px;margin-bottom:28px}
        .lp-lang-pills{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
        .lp-lang-pill{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:white;border-radius:40px;padding:10px 24px;font-size:14px;font-weight:700;transition:all 0.2s}
        .lp-lang-pill.active{background:#16a34a;border-color:#16a34a}

        /* ── FAQ ── */
        .lp-faq-list{max-width:660px;margin:40px auto 0;display:flex;flex-direction:column;gap:10px}
        .lp-faq-item{border:1.5px solid #e5e7eb;border-radius:12px;overflow:hidden}
        .faq-q{width:100%;text-align:left;padding:16px 18px;background:white;border:none;cursor:pointer;font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:#0a0f0a;display:flex;justify-content:space-between;align-items:center;gap:12px;transition:background 0.15s}
        .faq-q:hover{background:#dcfce7}
        .faq-q .arrow{transition:transform 0.2s;font-size:12px;color:#16a34a;flex-shrink:0}
        .faq-q.open .arrow{transform:rotate(180deg)}
        .faq-a{padding:0 18px;max-height:0;overflow:hidden;transition:all 0.3s;font-size:13px;color:#374151;line-height:1.7}
        .faq-a.open{padding:0 18px 16px;max-height:200px}

        /* ── CTA FINAL ── */
        .lp-cta-final{background:linear-gradient(135deg,#16a34a,#14532d);padding:70px 20px;text-align:center}
        .lp-cta-final h2{font-size:clamp(24px,5vw,44px);font-weight:800;color:white;letter-spacing:-1px;margin-bottom:14px}
        .lp-cta-final p{font-size:16px;color:rgba(255,255,255,0.8);margin-bottom:32px}
        .lp-btn-white{background:white;color:#16a34a;padding:16px 36px;border-radius:12px;font-size:15px;font-weight:800;font-family:'Sora',sans-serif;text-decoration:none;display:inline-flex;align-items:center;gap:10px;transition:all 0.2s;box-shadow:0 4px 20px rgba(0,0,0,0.2)}
        .lp-btn-white:hover{transform:translateY(-3px);box-shadow:0 8px 28px rgba(0,0,0,0.25)}

        /* ── FOOTER ── */
        .lp-footer{background:#080c08;padding:40px 20px 28px;text-align:center}
        .lp-footer-logo{font-size:22px;font-weight:800;color:#16a34a;margin-bottom:6px}
        .lp-footer-sub{font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:24px}
        .lp-footer-links{display:flex;gap:20px;justify-content:center;flex-wrap:wrap;margin-bottom:24px}
        .lp-footer-links a{font-size:12px;color:rgba(255,255,255,0.5);text-decoration:none;transition:color 0.15s}
        .lp-footer-links a:hover{color:#16a34a}
        .lp-footer-copy{font-size:11px;color:rgba(255,255,255,0.3)}

        /* ── WHATSAPP ── */
        .lp-wa{position:fixed;bottom:20px;right:20px;z-index:999;width:54px;height:54px;border-radius:50%;background:#25d366;display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:26px;box-shadow:0 4px 18px rgba(37,211,102,0.4);transition:all 0.2s;animation:lpPulse 2s infinite}
        .lp-wa:hover{transform:scale(1.1)}

        @keyframes lpFadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes lpPulse{0%,100%{box-shadow:0 4px 18px rgba(37,211,102,0.4)}50%{box-shadow:0 4px 28px rgba(37,211,102,0.7)}}

        /* ── RESPONSIVE ── */
        @media(max-width:768px){
          .lp-stats{grid-template-columns:repeat(2,1fr)}
          .lp-nav-desktop{display:none}
          .lp-hamburger{display:flex}
          .lp-pricing-top,.lp-pricing-body{padding:24px 20px}
        }
        @media(min-width:769px){
          .lp-hamburger{display:none!important}
          .lp-mobile-menu{display:none!important}
          .lp-overlay{display:none!important}
        }
      `}</style>

      <div className="lp">

        {/* ── Overlay menu mobile ── */}
        <div className={`lp-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />

        {/* ── NAV ── */}
        <nav className="lp-nav">
          <a href="/" className="lp-logo">🏪 DIAG<span>OSO</span></a>

          {/* Desktop links */}
          <div className="lp-nav-desktop">
            {navLinks.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
          </div>

          {/* Actions desktop + mobile */}
          <div className="lp-nav-actions">
            {/* Bouton connexion */}
            <a href="/login" className="lp-btn-login">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              Connexion
            </a>
            {/* Bouton inscription — caché sur très petit mobile */}
            <a href="/register" className="lp-btn-register" style={{display:'none'}} id="reg-desktop">Commencer</a>

            {/* Hamburger */}
            <button className={`lp-hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </nav>

        {/* ── Menu mobile déroulant ── */}
        <div className={`lp-mobile-menu ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
          ))}
          <div className="lp-mobile-divider" />
          <div className="lp-mobile-actions">
            <a href="/login" className="lp-mobile-login" onClick={() => setMenuOpen(false)}>🔐 Connexion</a>
            <a href="/register" className="lp-mobile-register" onClick={() => setMenuOpen(false)}>🚀 Commencer</a>
          </div>
        </div>

        {/* ── HERO ── */}
        <section className="lp-hero">
          <div className="lp-hero-bg" />
          <div className="lp-hero-content">
            <div className="lp-badge">🇲🇱 Conçu pour les vendeurs maliens</div>
            <h1 className="lp-h1">
              Votre boutique en ligne,<br/>
              <span className="green">professionnelle</span> et<br/>
              <span className="gold">facile à gérer</span>
            </h1>
            <p className="lp-sub">DIAGOSO vous donne tous les outils pour vendre en ligne, gérer vos commandes et fidéliser vos clients — depuis votre téléphone, en français, bambara ou arabe.</p>
            <div className="lp-cta">
              <a href="/register" className="lp-btn-primary">🚀 Commencer gratuitement — 30 jours</a>
              <a href="/login" className="lp-btn-outline">🔐 Se connecter</a>
            </div>
            <div className="lp-proof">
              {['30 jours gratuits','Sans carte bancaire','Orange Money & Wave'].map(t => (
                <div key={t} className="lp-proof-item"><div className="lp-proof-dot"/>{t}</div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <div className="lp-stats">
          {[['100%','Made for Mali'],['3','Langues'],['5 000','FCFA / mois'],['30j','Essai gratuit']].map(([n,l]) => (
            <div key={l} style={{padding:8}}>
              <div className="lp-stat-num">{n}</div>
              <div className="lp-stat-label">{l}</div>
            </div>
          ))}
        </div>

        {/* ── PROBLÈMES ── */}
        <section className="lp-section lp-problems">
          <div className="lp-container">
            <div className="lp-section-badge" style={{background:'rgba(22,163,74,0.2)',color:'#4ade80'}}>😓 Le problème</div>
            <h2 className="lp-section-title" style={{color:'white'}}>Vous vous reconnaissez ?</h2>
            <p className="lp-section-sub">Ces problèmes freinent votre croissance chaque jour</p>
            <div className="lp-problems-grid">
              {[
                ['📱','Tout sur WhatsApp','Commandes perdues dans les messages, confusion totale.','→ DIAGOSO centralise tout'],
                ['📦','Stock incontrôlable','Vous vendez des articles épuisés. Des clients déçus.','→ Alertes stock automatiques'],
                ['🧾','Pas de comptabilité','Impossible de savoir combien vous avez gagné.','→ Tableau de bord en temps réel'],
                ['👻','Aucune présence propre','Dépendance totale à Facebook et ses algorithmes.','→ Boutique avec lien + QR Code'],
                ['🗣️','Communication non pro','Pas de confirmation automatique pour vos clients.','→ Messages WhatsApp automatiques'],
                ['🇫🇷','Outils inadaptés','Shopify, trop cher, pas en bambara, pas pour le Mali.','→ Français, Bambara, Arabe'],
              ].map(([icon,title,desc,arrow]) => (
                <div key={title} className="lp-problem-card">
                  <div className="lp-problem-icon">{icon}</div>
                  <div className="lp-problem-title">{title}</div>
                  <div className="lp-problem-desc">{desc}</div>
                  <span className="lp-problem-arrow">{arrow}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="lp-section" id="fonctionnalites" style={{background:'white'}}>
          <div className="lp-container">
            <div className="lp-section-badge">✨ La solution</div>
            <h2 className="lp-section-title">Tout ce dont vous avez besoin</h2>
            <p className="lp-section-sub">DIAGOSO regroupe tous les outils d'un vendeur pro, simplifiés pour le Mali.</p>
            <div className="lp-features-grid">
              {[
                ['🏪','Boutique personnalisée','Votre page avec lien et QR Code. Clients accèdent en un clic.'],
                ['📦','Catalogue complet','Photos, prix, stock. Alertes quand un produit est presque épuisé.'],
                ['🛒','Gestion commandes','Suivez chaque commande. Notifiez les clients sur WhatsApp.'],
                ['📊','Tableau de bord','Ventes du jour, semaine, mois. Vos produits les plus vendus.'],
                ['🧾','Factures PDF auto','Générez des factures pro en un clic pour chaque commande.'],
                ['🌍','Français·Bambara·Arabe','Premier e-commerce disponible en Bambara au Mali.'],
                ['🎨','Thèmes personnalisables','5 thèmes de couleurs pour votre boutique.'],
                ['📱','100% mobile','Gérez tout depuis votre téléphone, partout au Mali.'],
              ].map(([icon,title,desc]) => (
                <div key={title} className="lp-feature-card">
                  <div className="lp-feature-icon">{icon}</div>
                  <div className="lp-feature-title">{title}</div>
                  <div className="lp-feature-desc">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW ── */}
        <section className="lp-section" id="comment" style={{background:'linear-gradient(160deg,#f0fdf4,#f9fafb)',textAlign:'center'}}>
          <div className="lp-container">
            <div className="lp-section-badge">🚀 Simple</div>
            <h2 className="lp-section-title">Lancez votre boutique en 4 étapes</h2>
            <p className="lp-section-sub" style={{margin:'0 auto'}}>En moins de 10 minutes, votre boutique est en ligne.</p>
            <div className="lp-steps">
              {[['📝','Inscrivez-vous','Créez votre compte en 2 minutes. Boutique créée automatiquement.'],
                ['📸','Ajoutez vos produits','Photos, prix, stock. Simple comme poster sur Facebook.'],
                ['🔗','Partagez','Lien WhatsApp, Facebook, QR Code imprimé.'],
                ['💰','Encaissez','Gérez commandes et paiements depuis DIAGOSO.']
              ].map(([icon,title,desc]) => (
                <div key={title} className="lp-step">
                  <div className="lp-step-num">{icon}</div>
                  <div className="lp-step-title">{title}</div>
                  <div className="lp-step-desc">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="lp-section" id="prix" style={{background:'white',textAlign:'center'}}>
          <div className="lp-container">
            <div className="lp-section-badge">💰 Tarif</div>
            <h2 className="lp-section-title">Un prix unique, transparent</h2>
            <p className="lp-section-sub" style={{margin:'0 auto'}}>Pas de commission sur vos ventes. Jamais.</p>
            <div className="lp-pricing-card">
              <div className="lp-pricing-top">
                <div className="lp-pricing-badge">⭐ Offre lancement</div>
                <div className="lp-pricing-name">DIAGOSO Pro</div>
                <div className="lp-pricing-price">5 000 <span>FCFA/mois</span></div>
                <div className="lp-pricing-trial">🎁 30 premiers jours GRATUITS</div>
              </div>
              <div className="lp-pricing-body">
                <ul className="lp-pricing-features">
                  {['Boutique illimitée','Produits & commandes illimités','Tableau de bord','Factures PDF','QR Code','Bambara · Français · Arabe','Support WhatsApp','Orange Money & Wave'].map(f=><li key={f}>{f}</li>)}
                </ul>
                <a href="/register" className="lp-pricing-cta">Commencer gratuitement 🚀</a>
                <p className="lp-pricing-note">Sans engagement · Résiliable à tout moment</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="lp-section" style={{background:'#f9fafb'}}>
          <div className="lp-container">
            <div className="lp-section-badge">💬 Témoignages</div>
            <h2 className="lp-section-title">Ce que disent nos vendeurs</h2>
            <div className="lp-testi-grid">
              {[
                ['F','Fatoumata Coulibaly','Pagnes · Bamako','"Avant je perdais des commandes dans WhatsApp. Maintenant tout est organisé et mes clients reçoivent une confirmation automatique !"'],
                ['M','Mamadou Traoré','Chaussures · Ségou','"J\'ai mis mon QR Code sur ma devanture. Les clients scannent et voient mes produits. Mon CA a augmenté de 40% en 2 mois !"'],
                ['A','Aminata Diallo','Cosmétiques · Mopti','"Le tableau de bord me montre exactement combien je gagne. Enfin je gère mon business comme un vrai entrepreneur !"'],
              ].map(([init,name,role,text])=>(
                <div key={name} className="lp-testi-card">
                  <div className="lp-testi-stars">★★★★★</div>
                  <p className="lp-testi-text">{text}</p>
                  <div className="lp-testi-author">
                    <div className="lp-testi-avatar">{init}</div>
                    <div><div className="lp-testi-name">{name}</div><div className="lp-testi-role">{role}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LANGUAGES ── */}
        <div className="lp-langs">
          <h2>🌍 DIAGOSO parle votre langue</h2>
          <p>Premier outil e-commerce en Bambara au Mali</p>
          <div className="lp-lang-pills">
            <div className="lp-lang-pill active">🇫🇷 Français</div>
            <div className="lp-lang-pill">🇲🇱 Bamanankan</div>
            <div className="lp-lang-pill">🕌 العربية</div>
          </div>
        </div>

        {/* ── FAQ ── */}
        <section className="lp-section" id="faq" style={{background:'white',textAlign:'center'}}>
          <div className="lp-container">
            <div className="lp-section-badge">❓ FAQ</div>
            <h2 className="lp-section-title">Questions fréquentes</h2>
            <div className="lp-faq-list">
              {[
                ['Fonctionne sans wifi rapide ?','Oui, une connexion 3G normale suffit.'],
                ['Comment payer les 5 000 FCFA ?','Via Orange Money ou Wave au +223 72 78 51 07. Confirmation immédiate dans l\'app.'],
                ['Puis-je annuler à tout moment ?','Oui, sans engagement. Vos données restent jusqu\'à fin de période payée.'],
                ['Mes clients créent un compte ?','Non ! Ils accèdent via votre lien ou QR Code et commandent via WhatsApp.'],
                ['Commission sur mes ventes ?','Zéro commission. 100% de vos ventes vous appartiennent.'],
                ['iPhone et Android ?','Oui, tous les téléphones. Ouvrez diagoso.vercel.app dans votre navigateur.'],
              ].map(([q,a],i)=>(
                <div key={i} className="lp-faq-item">
                  <button className="faq-q" onClick={()=>toggleFaq(i)}>{q}<span className="arrow">▼</span></button>
                  <div className="faq-a">{a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="lp-cta-final">
          <h2>Prêt à professionnaliser<br/>votre commerce ?</h2>
          <p>30 jours gratuits. Aucune carte bancaire.</p>
          <a href="/register" className="lp-btn-white">🚀 Créer ma boutique gratuitement</a>
        </section>

        {/* ── FOOTER ── */}
        <footer className="lp-footer">
          <div className="lp-footer-logo">🏪 DIAGOSO</div>
          <div className="lp-footer-sub">La Maison du Commerce · Mali</div>
          <div className="lp-footer-links">
            {[['#fonctionnalites','Fonctionnalités'],['#prix','Tarifs'],['#faq','FAQ'],['/login','Connexion'],['/register','S\'inscrire'],['https://wa.me/22372785107','Support']].map(([h,l])=>(
              <a key={l} href={h}>{l}</a>
            ))}
          </div>
          <div className="lp-footer-copy">© 2026 DIAGOSO · Bamako, Mali</div>
        </footer>

        {/* ── WhatsApp flottant ── */}
        <a href="https://wa.me/22372785107?text=Bonjour, je voudrais en savoir plus sur DIAGOSO" className="lp-wa" title="WhatsApp">💬</a>

      </div>
    </>
  );
}