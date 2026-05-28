import React, { useEffect } from 'react';

export default function Landing() {
  useEffect(() => {
    // Inject Google Fonts
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
    if (!isOpen) {
      allQ[index]?.classList.add('open');
      allA[index]?.classList.add('open');
    }
  };

  return (
    <>
      <style>{`
        .lp * { box-sizing: border-box; margin: 0; padding: 0; }
        .lp { font-family: 'Sora', sans-serif; background: #f9fafb; color: #0a0f0a; overflow-x: hidden; }
        /* NAV */
        .lp-nav { position: fixed; top:0; left:0; right:0; z-index:100; background: rgba(255,255,255,0.95); backdrop-filter: blur(16px); border-bottom: 1px solid #e5e7eb; padding: 0 24px; height: 64px; display:flex; align-items:center; justify-content:space-between; }
        .lp-logo { font-size:20px; font-weight:800; color:#16a34a; letter-spacing:-0.5px; text-decoration:none; }
        .lp-logo span { color:#d97706; }
        .lp-navlinks { display:flex; align-items:center; gap:8px; }
        .lp-navlinks a { font-size:13px; font-weight:600; color:#374151; text-decoration:none; padding:8px 14px; border-radius:8px; transition:all 0.15s; }
        .lp-navlinks a:hover { background:#dcfce7; color:#16a34a; }
        .lp-btn-green { background:#16a34a!important; color:white!important; border-radius:10px!important; }
        .lp-btn-gold { background:#d97706!important; color:white!important; border-radius:10px!important; }
        /* HERO */
        .lp-hero { min-height:100vh; padding:100px 24px 60px; display:flex; align-items:center; justify-content:center; background:linear-gradient(160deg,#f0fdf4 0%,#fff 50%,#fefce8 100%); position:relative; overflow:hidden; }
        .lp-hero-bg { position:absolute; inset:0; background-image:radial-gradient(circle at 20% 20%,rgba(22,163,74,0.08) 0%,transparent 50%),radial-gradient(circle at 80% 80%,rgba(217,119,6,0.08) 0%,transparent 50%); pointer-events:none; }
        .lp-hero-content { max-width:720px; text-align:center; position:relative; z-index:2; animation:lpFadeUp 0.8s ease both; }
        .lp-badge { display:inline-flex; align-items:center; gap:8px; background:#dcfce7; color:#16a34a; border:1px solid rgba(22,163,74,0.3); border-radius:40px; padding:8px 18px; font-size:13px; font-weight:700; margin-bottom:28px; }
        .lp-h1 { font-size:clamp(36px,6vw,64px); font-weight:800; line-height:1.1; letter-spacing:-2px; margin-bottom:24px; }
        .lp-h1 .green { color:#16a34a; }
        .lp-h1 .gold { color:#d97706; }
        .lp-sub { font-size:clamp(15px,2vw,19px); color:#374151; max-width:560px; margin:0 auto 36px; line-height:1.7; }
        .lp-cta { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }
        .lp-btn-primary { background:#16a34a; color:white; padding:16px 32px; border-radius:12px; font-size:15px; font-weight:700; font-family:'Sora',sans-serif; text-decoration:none; display:inline-flex; align-items:center; gap:8px; transition:all 0.2s; box-shadow:0 4px 20px rgba(22,163,74,0.35); }
        .lp-btn-primary:hover { background:#14532d; transform:translateY(-2px); }
        .lp-btn-outline { background:white; color:#0a0f0a; padding:16px 32px; border-radius:12px; font-size:15px; font-weight:700; font-family:'Sora',sans-serif; text-decoration:none; display:inline-flex; align-items:center; gap:8px; transition:all 0.2s; border:1.5px solid #e5e7eb; }
        .lp-btn-outline:hover { border-color:#16a34a; color:#16a34a; transform:translateY(-2px); }
        .lp-proof { margin-top:48px; display:flex; align-items:center; justify-content:center; gap:24px; flex-wrap:wrap; }
        .lp-proof-item { display:flex; align-items:center; gap:8px; font-size:13px; color:#6b7280; font-weight:600; }
        .lp-proof-dot { width:6px; height:6px; border-radius:50%; background:#16a34a; }
        /* STATS */
        .lp-stats { background:#16a34a; padding:28px 24px; display:grid; grid-template-columns:repeat(4,1fr); text-align:center; }
        .lp-stat-num { font-size:clamp(22px,4vw,36px); font-weight:800; color:white; letter-spacing:-1px; }
        .lp-stat-label { font-size:11px; color:rgba(255,255,255,0.75); font-weight:600; margin-top:4px; text-transform:uppercase; letter-spacing:0.5px; }
        /* SECTIONS */
        .lp-section { padding:80px 24px; }
        .lp-container { max-width:1100px; margin:0 auto; }
        .lp-section-badge { display:inline-flex; align-items:center; background:#dcfce7; color:#16a34a; border-radius:40px; padding:6px 14px; font-size:12px; font-weight:700; margin-bottom:16px; text-transform:uppercase; letter-spacing:0.5px; }
        .lp-section-title { font-size:clamp(26px,4vw,42px); font-weight:800; letter-spacing:-1px; line-height:1.2; margin-bottom:16px; }
        .lp-section-sub { font-size:16px; color:#374151; max-width:560px; line-height:1.7; }
        /* PROBLEMS */
        .lp-problems { background:#0a0f0a; }
        .lp-problems-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:2px; margin-top:48px; border-radius:16px; overflow:hidden; }
        .lp-problem-card { background:#111; padding:28px; transition:background 0.2s; }
        .lp-problem-card:hover { background:#161b16; }
        .lp-problem-icon { font-size:28px; margin-bottom:14px; }
        .lp-problem-title { font-size:15px; font-weight:700; color:white; margin-bottom:8px; }
        .lp-problem-desc { font-size:13px; color:rgba(255,255,255,0.5); line-height:1.6; }
        .lp-problem-arrow { color:#4ade80; font-size:13px; font-weight:700; margin-top:12px; display:block; }
        /* FEATURES */
        .lp-features-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:20px; margin-top:48px; }
        .lp-feature-card { border:1.5px solid #e5e7eb; border-radius:16px; padding:28px; transition:all 0.2s; }
        .lp-feature-card:hover { border-color:#16a34a; transform:translateY(-4px); box-shadow:0 4px 24px rgba(0,0,0,0.08); }
        .lp-feature-icon { width:52px; height:52px; border-radius:14px; background:#dcfce7; display:flex; align-items:center; justify-content:center; font-size:24px; margin-bottom:16px; }
        .lp-feature-title { font-size:16px; font-weight:700; margin-bottom:8px; }
        .lp-feature-desc { font-size:13.5px; color:#374151; line-height:1.7; }
        /* STEPS */
        .lp-steps { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:32px; margin-top:48px; }
        .lp-step { text-align:center; padding:0 16px; }
        .lp-step-num { width:72px; height:72px; border-radius:50%; background:white; border:3px solid #16a34a; display:flex; align-items:center; justify-content:center; font-size:28px; margin:0 auto 20px; box-shadow:0 4px 16px rgba(22,163,74,0.2); }
        .lp-step-title { font-size:15px; font-weight:700; margin-bottom:8px; }
        .lp-step-desc { font-size:13px; color:#6b7280; line-height:1.6; }
        /* PRICING */
        .lp-pricing-card { max-width:480px; margin:48px auto 0; border:2.5px solid #16a34a; border-radius:24px; overflow:hidden; box-shadow:0 16px 48px rgba(22,163,74,0.15); }
        .lp-pricing-top { background:#16a34a; padding:36px 40px; text-align:center; }
        .lp-pricing-badge { display:inline-block; background:#d97706; color:white; font-size:11px; font-weight:800; padding:4px 14px; border-radius:40px; margin-bottom:16px; text-transform:uppercase; letter-spacing:1px; }
        .lp-pricing-name { font-size:22px; font-weight:800; color:white; margin-bottom:8px; }
        .lp-pricing-price { font-size:52px; font-weight:800; color:white; letter-spacing:-2px; line-height:1; }
        .lp-pricing-price span { font-size:18px; font-weight:600; opacity:0.8; }
        .lp-pricing-trial { font-size:13px; color:rgba(255,255,255,0.8); margin-top:8px; font-weight:600; }
        .lp-pricing-body { padding:36px 40px; background:white; }
        .lp-pricing-features { list-style:none; display:flex; flex-direction:column; gap:14px; margin-bottom:28px; }
        .lp-pricing-features li { display:flex; align-items:center; gap:12px; font-size:14px; color:#374151; font-weight:500; }
        .lp-pricing-features li::before { content:'✅'; font-size:16px; flex-shrink:0; }
        .lp-pricing-cta { width:100%; padding:16px; background:#16a34a; color:white; border:none; border-radius:12px; font-size:16px; font-weight:700; font-family:'Sora',sans-serif; cursor:pointer; text-decoration:none; display:block; text-align:center; transition:all 0.2s; }
        .lp-pricing-cta:hover { background:#14532d; transform:translateY(-2px); }
        .lp-pricing-note { text-align:center; font-size:12px; color:#6b7280; margin-top:12px; }
        /* TESTIMONIALS */
        .lp-testi-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:20px; margin-top:48px; }
        .lp-testi-card { background:white; border-radius:16px; padding:28px; border:1px solid #e5e7eb; transition:all 0.2s; }
        .lp-testi-card:hover { box-shadow:0 4px 24px rgba(0,0,0,0.08); transform:translateY(-3px); }
        .lp-testi-stars { color:#d97706; font-size:18px; margin-bottom:14px; }
        .lp-testi-text { font-size:14px; color:#374151; line-height:1.7; margin-bottom:20px; font-style:italic; }
        .lp-testi-author { display:flex; align-items:center; gap:12px; }
        .lp-testi-avatar { width:44px; height:44px; border-radius:50%; background:#dcfce7; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:16px; color:#16a34a; flex-shrink:0; }
        .lp-testi-name { font-weight:700; font-size:14px; }
        .lp-testi-role { font-size:12px; color:#6b7280; }
        /* LANGUAGES */
        .lp-langs { background:#0a0f0a; padding:60px 24px; text-align:center; }
        .lp-langs h2 { font-size:28px; font-weight:800; color:white; margin-bottom:8px; }
        .lp-langs p { color:rgba(255,255,255,0.5); font-size:15px; margin-bottom:36px; }
        .lp-lang-pills { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; }
        .lp-lang-pill { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); color:white; border-radius:40px; padding:12px 28px; font-size:15px; font-weight:700; transition:all 0.2s; }
        .lp-lang-pill.active { background:#16a34a; border-color:#16a34a; }
        /* FAQ */
        .lp-faq-list { max-width:680px; margin:48px auto 0; display:flex; flex-direction:column; gap:12px; }
        .lp-faq-item { border:1.5px solid #e5e7eb; border-radius:12px; overflow:hidden; }
        .faq-q { width:100%; text-align:left; padding:18px 20px; background:white; border:none; cursor:pointer; font-family:'Sora',sans-serif; font-size:14px; font-weight:700; color:#0a0f0a; display:flex; justify-content:space-between; align-items:center; gap:12px; transition:background 0.15s; }
        .faq-q:hover { background:#dcfce7; }
        .faq-q .arrow { transition:transform 0.2s; font-size:12px; color:#16a34a; }
        .faq-q.open .arrow { transform:rotate(180deg); }
        .faq-a { padding:0 20px; max-height:0; overflow:hidden; transition:all 0.3s; font-size:14px; color:#374151; line-height:1.7; }
        .faq-a.open { padding:0 20px 18px; max-height:200px; }
        /* CTA FINAL */
        .lp-cta-final { background:linear-gradient(135deg,#16a34a,#14532d); padding:80px 24px; text-align:center; }
        .lp-cta-final h2 { font-size:clamp(28px,5vw,48px); font-weight:800; color:white; letter-spacing:-1px; margin-bottom:16px; }
        .lp-cta-final p { font-size:17px; color:rgba(255,255,255,0.8); margin-bottom:36px; }
        .lp-btn-white { background:white; color:#16a34a; padding:18px 40px; border-radius:12px; font-size:16px; font-weight:800; font-family:'Sora',sans-serif; text-decoration:none; display:inline-flex; align-items:center; gap:10px; transition:all 0.2s; box-shadow:0 4px 20px rgba(0,0,0,0.2); }
        .lp-btn-white:hover { transform:translateY(-3px); box-shadow:0 8px 32px rgba(0,0,0,0.25); }
        /* FOOTER */
        .lp-footer { background:#080c08; padding:48px 24px 32px; text-align:center; }
        .lp-footer-logo { font-size:24px; font-weight:800; color:#16a34a; margin-bottom:8px; }
        .lp-footer-sub { font-size:13px; color:rgba(255,255,255,0.4); margin-bottom:28px; }
        .lp-footer-links { display:flex; gap:24px; justify-content:center; flex-wrap:wrap; margin-bottom:28px; }
        .lp-footer-links a { font-size:13px; color:rgba(255,255,255,0.5); text-decoration:none; transition:color 0.15s; }
        .lp-footer-links a:hover { color:#16a34a; }
        .lp-footer-copy { font-size:12px; color:rgba(255,255,255,0.3); }
        /* WHATSAPP */
        .lp-wa { position:fixed; bottom:24px; right:24px; z-index:999; width:58px; height:58px; border-radius:50%; background:#25d366; display:flex; align-items:center; justify-content:center; text-decoration:none; font-size:28px; box-shadow:0 4px 20px rgba(37,211,102,0.4); transition:all 0.2s; animation:lpPulse 2s infinite; }
        .lp-wa:hover { transform:scale(1.1); }
        @keyframes lpFadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lpPulse { 0%,100%{box-shadow:0 4px 20px rgba(37,211,102,0.4)} 50%{box-shadow:0 4px 32px rgba(37,211,102,0.7)} }
        @media(max-width:768px){
          .lp-stats{grid-template-columns:repeat(2,1fr)}
          .lp-navlinks{display:none}
          .lp-pricing-top,.lp-pricing-body{padding:28px 24px}
        }
      `}</style>

      <div className="lp">
        {/* NAV */}
        <nav className="lp-nav">
          <a href="/" className="lp-logo">🏪 DIAG<span>OSO</span></a>
          <div className="lp-navlinks">
            <a href="#fonctionnalites">Fonctionnalités</a>
            <a href="#comment">Comment ça marche</a>
            <a href="#prix">Tarifs</a>
            <a href="#faq">FAQ</a>
            <a href="/login" className="lp-btn-green">Se connecter</a>
            <a href="/register" className="lp-btn-gold">Commencer gratuit</a>
          </div>
        </nav>

        {/* HERO */}
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
              <a href="#fonctionnalites" className="lp-btn-outline">Voir les fonctionnalités →</a>
            </div>
            <div className="lp-proof">
              {['30 jours d\'essai gratuit','Aucune carte bancaire','Orange Money & Wave'].map(t => (
                <div key={t} className="lp-proof-item"><div className="lp-proof-dot"/>{t}</div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="lp-stats">
          {[['100%','Made for Mali'],['3','Langues disponibles'],['5 000','FCFA / mois'],['30j','Essai gratuit']].map(([n,l]) => (
            <div key={l} style={{padding:8}}>
              <div className="lp-stat-num">{n}</div>
              <div className="lp-stat-label">{l}</div>
            </div>
          ))}
        </div>

        {/* PROBLÈMES */}
        <section className="lp-section lp-problems">
          <div className="lp-container">
            <div className="lp-section-badge" style={{background:'rgba(22,163,74,0.2)',color:'#4ade80'}}>😓 Le problème</div>
            <h2 className="lp-section-title" style={{color:'white'}}>Vous vous reconnaissez ?</h2>
            <p className="lp-section-sub">Ces problèmes freinent votre croissance chaque jour</p>
            <div className="lp-problems-grid">
              {[
                ['📱','Tout se passe sur WhatsApp','Commandes perdues dans les messages, confusion totale entre les conversations.','→ DIAGOSO centralise tout'],
                ['📦','Stock incontrôlable','Vous vendez des articles déjà épuisés. Des clients déçus, une réputation abîmée.','→ Alertes stock automatiques'],
                ['🧾','Pas de comptabilité','Impossible de savoir combien vous avez gagné ce mois. Tout est dans la tête.','→ Tableau de bord en temps réel'],
                ['👻','Aucune présence en ligne propre','Dépendance totale à Facebook. Vos clients ne trouvent pas votre boutique.','→ Boutique avec lien + QR Code'],
                ['🗣️','Communication non professionnelle','Pas de confirmation automatique. Le client ne sait pas où en est sa commande.','→ Messages WhatsApp automatiques'],
                ['🇫🇷','Outils pas adaptés au Mali','Shopify, WooCommerce... trop complexes, trop chers, pas en bambara.','→ Français, Bambara, Arabe'],
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

        {/* FEATURES */}
        <section className="lp-section" id="fonctionnalites" style={{background:'white'}}>
          <div className="lp-container">
            <div className="lp-section-badge">✨ La solution</div>
            <h2 className="lp-section-title">Tout ce dont vous avez besoin,<br/>dans une seule app</h2>
            <p className="lp-section-sub">DIAGOSO regroupe tous les outils d'un vendeur professionnel, simplifiés pour le marché malien.</p>
            <div className="lp-features-grid">
              {[
                ['🏪','Boutique en ligne personnalisée','Votre propre page avec lien partageable et QR Code. Vos clients accèdent à vos produits en un clic.'],
                ['📦','Catalogue produits complet','Ajoutez vos produits avec photos, prix et stock. Alertes automatiques quand un produit est presque épuisé.'],
                ['🛒','Gestion des commandes','Suivez chaque commande de la réception à la livraison. Notifiez vos clients automatiquement sur WhatsApp.'],
                ['📊','Tableau de bord analytique','Visualisez vos ventes du jour, de la semaine et du mois. Identifiez vos produits les plus vendus.'],
                ['🧾','Factures PDF automatiques','Générez des factures professionnelles en un clic. Partagez-les avec vos clients pour paraître sérieux.'],
                ['🌍','Français · Bambara · Arabe','Premier outil e-commerce disponible en Bambara au Mali. Changez de langue en un clic.'],
                ['🎨','Thèmes personnalisables','Choisissez parmi 5 thèmes de couleurs. Personnalisez votre boutique à votre image.'],
                ['📱','100% mobile friendly','Fonctionne parfaitement sur tous les téléphones. Gérez tout depuis votre smartphone, partout au Mali.'],
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

        {/* HOW */}
        <section className="lp-section" id="comment" style={{background:'linear-gradient(160deg,#f0fdf4,#f9fafb)',textAlign:'center'}}>
          <div className="lp-container">
            <div className="lp-section-badge">🚀 Simple comme bonjour</div>
            <h2 className="lp-section-title">Lancez votre boutique en 4 étapes</h2>
            <p className="lp-section-sub" style={{margin:'0 auto'}}>En moins de 10 minutes, votre boutique est en ligne.</p>
            <div className="lp-steps">
              {[['📝','Inscrivez-vous','Créez votre compte gratuitement. Votre boutique est immédiatement créée.'],
                ['📸','Ajoutez vos produits','Mettez vos articles avec photos et prix. Facile comme poster sur Facebook.'],
                ['🔗','Partagez votre boutique','Envoyez votre lien sur WhatsApp, Facebook. Imprimez votre QR Code.'],
                ['💰','Recevez des commandes','Gérez tout depuis DIAGOSO. Vos clients commandent, vous encaissez.']
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

        {/* PRICING */}
        <section className="lp-section" id="prix" style={{background:'white',textAlign:'center'}}>
          <div className="lp-container">
            <div className="lp-section-badge">💰 Tarif</div>
            <h2 className="lp-section-title">Un prix unique, transparent</h2>
            <p className="lp-section-sub" style={{margin:'0 auto'}}>Pas de frais cachés. Pas de commission sur vos ventes.</p>
            <div className="lp-pricing-card">
              <div className="lp-pricing-top">
                <div className="lp-pricing-badge">⭐ Offre de lancement</div>
                <div className="lp-pricing-name">DIAGOSO Pro</div>
                <div className="lp-pricing-price">5 000 <span>FCFA/mois</span></div>
                <div className="lp-pricing-trial">🎁 30 premiers jours GRATUITS</div>
              </div>
              <div className="lp-pricing-body">
                <ul className="lp-pricing-features">
                  {['Boutique en ligne illimitée','Produits et commandes illimités','Tableau de bord et statistiques','Factures PDF automatiques','QR Code de votre boutique','Multilingue Français / Bambara / Arabe','Support par WhatsApp','Paiement Orange Money ou Wave'].map(f => <li key={f}>{f}</li>)}
                </ul>
                <a href="/register" className="lp-pricing-cta">Commencer gratuitement 🚀</a>
                <p className="lp-pricing-note">Sans engagement · Résiliable à tout moment</p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="lp-section" style={{background:'#f9fafb'}}>
          <div className="lp-container">
            <div className="lp-section-badge">💬 Témoignages</div>
            <h2 className="lp-section-title">Ce que disent nos vendeurs</h2>
            <div className="lp-testi-grid">
              {[
                ['F','Fatoumata Coulibaly','Vente de pagnes · Bamako','"Avant DIAGOSO je perdais des commandes dans mes messages WhatsApp. Maintenant tout est organisé et mes clients reçoivent une confirmation automatique !"'],
                ['M','Mamadou Traoré','Vente de chaussures · Ségou','"J\'ai partagé mon QR Code sur ma devanture. Mes clients scannent directement pour voir mes produits. Mon chiffre d\'affaires a augmenté de 40% !"'],
                ['A','Aminata Diallo','Cosmétiques · Mopti','"Le tableau de bord me montre exactement combien je gagne chaque jour. Enfin je peux gérer mon business comme un vrai entrepreneur !"'],
              ].map(([init,name,role,text]) => (
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

        {/* LANGUAGES */}
        <div className="lp-langs">
          <h2>🌍 DIAGOSO parle votre langue</h2>
          <p>Premier outil e-commerce disponible en Bambara au Mali</p>
          <div className="lp-lang-pills">
            <div className="lp-lang-pill active">🇫🇷 Français</div>
            <div className="lp-lang-pill">🇲🇱 Bamanankan</div>
            <div className="lp-lang-pill">🕌 العربية</div>
          </div>
        </div>

        {/* FAQ */}
        <section className="lp-section" id="faq" style={{background:'white',textAlign:'center'}}>
          <div className="lp-container">
            <div className="lp-section-badge">❓ FAQ</div>
            <h2 className="lp-section-title">Questions fréquentes</h2>
            <div className="lp-faq-list">
              {[
                ['Est-ce que DIAGOSO fonctionne sans connexion internet ?','DIAGOSO nécessite une connexion internet. Il fonctionne avec une connexion 3G normale — pas besoin de wifi rapide.'],
                ['Comment payer mon abonnement de 5 000 FCFA ?','Via Orange Money ou Wave sur le numéro +223 72 78 51 07. Confirmation dans l\'application dès validation.'],
                ['Puis-je annuler mon abonnement à tout moment ?','Oui, DIAGOSO est sans engagement. Vos données restent accessibles jusqu\'à la fin de la période payée.'],
                ['Mes clients ont-ils besoin d\'un compte pour commander ?','Non ! Vos clients accèdent à votre boutique via votre lien ou QR Code et vous contactent sur WhatsApp.'],
                ['DIAGOSO prend-il une commission sur mes ventes ?','Absolument pas ! Zéro commission. Vous payez uniquement l\'abonnement mensuel de 5 000 FCFA.'],
                ['Ça marche sur iPhone et Android ?','Oui ! DIAGOSO fonctionne sur tous les téléphones. Ouvrez simplement le site dans votre navigateur.'],
              ].map(([q, a], i) => (
                <div key={i} className="lp-faq-item">
                  <button className="faq-q" onClick={() => toggleFaq(i)}>
                    {q}<span className="arrow">▼</span>
                  </button>
                  <div className="faq-a">{a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="lp-cta-final">
          <h2>Prêt à professionnaliser<br/>votre commerce ?</h2>
          <p>Rejoignez les vendeurs maliens qui font confiance à DIAGOSO.<br/>30 jours gratuits, sans carte bancaire.</p>
          <a href="/register" className="lp-btn-white">🚀 Créer ma boutique gratuitement</a>
        </section>

        {/* FOOTER */}
        <footer className="lp-footer">
          <div className="lp-footer-logo">🏪 DIAGOSO</div>
          <div className="lp-footer-sub">La Maison du Commerce · Mali</div>
          <div className="lp-footer-links">
            {[['#fonctionnalites','Fonctionnalités'],['#prix','Tarifs'],['#faq','FAQ'],['/login','Connexion'],['/register','S\'inscrire'],['https://wa.me/22372785107','Support WhatsApp']].map(([href,label]) => (
              <a key={label} href={href}>{label}</a>
            ))}
          </div>
          <div className="lp-footer-copy">© 2026 DIAGOSO · Tous droits réservés · Bamako, Mali</div>
        </footer>

        {/* WhatsApp flottant */}
        <a href="https://wa.me/22372785107?text=Bonjour, je voudrais en savoir plus sur DIAGOSO" className="lp-wa" title="Contactez-nous">💬</a>
      </div>
    </>
  );
}
