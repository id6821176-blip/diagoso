# 🏪 DIAGOSO — Guide de Déploiement Complet
## "La Maison du Commerce" · Mali

---

## ✅ ÉTAPE 1 — Créer le projet Supabase (base de données)

1. Allez sur **https://supabase.com** et créez un compte gratuit
2. Cliquez **"New Project"**
   - Nom : `diagoso`
   - Mot de passe DB : (notez-le)
   - Région : choisissez la plus proche (Europe West)
3. Attendez ~2 minutes que le projet se crée
4. Dans le menu gauche → **SQL Editor** → cliquez **"New query"**
5. Copiez-collez tout le contenu du fichier `supabase_schema.sql` et cliquez **Run**
6. Récupérez vos clés :
   - Menu gauche → **Settings** → **API**
   - Copiez **Project URL** → c'est votre `SUPABASE_URL`
   - Copiez **anon public** → c'est votre `SUPABASE_ANON_KEY`

---

## ✅ ÉTAPE 2 — Créer votre compte Admin

1. Dans Supabase → menu gauche → **Authentication** → **Users**
2. Cliquez **"Add user"** → **"Create new user"**
   - Email : `id6821176@gmail.com`
   - Password : `Diak7278`
   - ✅ Cochez "Auto Confirm User"
3. Notez l'**UUID** de l'utilisateur créé
4. Dans **SQL Editor**, exécutez :
```sql
INSERT INTO profiles (id, email, full_name, phone, shop_name, shop_slug, role, subscription_status, subscription_accepted)
VALUES (
  'VOTRE-UUID-ICI',
  'id6821176@gmail.com',
  'Administrateur DIAGOSO',
  '+223 00 00 00 00',
  'DIAGOSO Admin',
  'admin-diagoso',
  'admin',
  'active',
  true
);
```
Remplacez `VOTRE-UUID-ICI` par l'UUID copié.

---

## ✅ ÉTAPE 3 — Configurer les variables d'environnement

1. Copiez le fichier `.env.example` et renommez-le `.env`
2. Remplissez vos valeurs :
```
REACT_APP_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ✅ ÉTAPE 4 — Lancer le projet en local (test)

```bash
# Dans le dossier diagoso/
npm install
npm start
```

L'application s'ouvre sur **http://localhost:3000**

Connectez-vous avec :
- Email : `id6821176@gmail.com`
- Mot de passe : `Diak7278`

---

## ✅ ÉTAPE 5 — Déployer sur Vercel (mise en ligne gratuite)

1. Allez sur **https://vercel.com** et créez un compte (avec GitHub)
2. Sur GitHub, créez un nouveau repo et poussez le projet :
```bash
git init
git add .
git commit -m "DIAGOSO v1.0 - La Maison du Commerce"
git remote add origin https://github.com/VOTRE-COMPTE/diagoso.git
git push -u origin main
```
3. Sur Vercel → **"New Project"** → importez votre repo GitHub
4. Ajoutez les variables d'environnement :
   - `REACT_APP_SUPABASE_URL` = votre URL Supabase
   - `REACT_APP_SUPABASE_ANON_KEY` = votre clé Supabase
5. Cliquez **Deploy** → votre app est en ligne !

---

## ✅ ÉTAPE 6 — Configurer votre domaine (optionnel)

Si vous achetez le domaine `diagoso.ml` ou `diagoso.com` :
1. Dans Vercel → Settings → Domains
2. Ajoutez votre domaine
3. Suivez les instructions DNS

---

## 📋 STRUCTURE DES FICHIERS

```
diagoso/
├── public/
│   │── landing.html
│   └── index.html
├── src/
│   ├── components/
│   │   ├── shared/
│   │   │   ├── Sidebar.js
│   │   │   └── Header.js
│   │   └── vendor/
│   │       ├── OrderForm.js
│   │       └── InvoicePDF.js
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── LangContext.js
│   ├── i18n/
│   │   └── translations.js
│   ├── lib/
│   │   └── supabase.js
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── vendor/
│   │   │   ├── Dashboard.js
│   │   │   ├── Products.js
│   │   │   ├── Orders.js
│   │   │   ├── OrderDetail.js
│   │   │   ├── Invoices.js
│   │   │   ├── Shop.js
│   │   │   ├── Settings.js
│   │   │   ├── Notifications.js
│   │   │   └── PublicShop.js
│   │   └── admin/
│   │       ├── AdminDashboard.js
│   │       ├── AdminVendors.js
│   │       └── AdminInvoices.js
│   ├── styles/
│   │   └── global.css
│   ├── App.js
│   └── index.js
├── supabase_schema.sql
├── .env.example
└── package.json
```

---

## 🎯 FONCTIONNALITÉS COMPLÈTES

### Vendeurs
- ✅ Inscription avec consentement abonnement 10 000 FCFA/mois
- ✅ 30 jours d'essai gratuit automatique
- ✅ Tableau de bord avec statistiques et graphiques
- ✅ Gestion catalogue produits (ajout, modification, suppression)
- ✅ Alertes stock faible automatiques
- ✅ Création et gestion des commandes
- ✅ Mise à jour statut commandes en temps réel
- ✅ Envoi message WhatsApp automatique au client
- ✅ Génération facture PDF par commande
- ✅ Page boutique publique partageable (lien + QR Code)
- ✅ Multilingue : Français / Bambara / Arabe
- ✅ 5 thèmes de couleurs personnalisables
- ✅ Consultation factures d'abonnement mensuelles

### Admin (vous)
- ✅ Vue globale plateforme (vendeurs, commandes, revenus)
- ✅ Projection revenus mensuel/trimestriel/annuel
- ✅ Gestion tous les vendeurs (activer/désactiver/supprimer)
- ✅ Génération factures mensuelles en 1 clic pour tous les vendeurs
- ✅ Suivi paiements abonnements (marquer comme payé)
- ✅ Téléchargement PDF toutes les factures
- ✅ Accès avec email : id6821176@gmail.com

---

## 💰 MODÈLE ÉCONOMIQUE

| Vendeurs actifs | Revenu mensuel | Revenu annuel |
|-----------------|----------------|---------------|
| 10 vendeurs     | 100 000 FCFA   | 1 200 000 FCFA |
| 50 vendeurs     | 500 000 FCFA   | 6 000 000 FCFA |
| 100 vendeurs    | 1 000 000 FCFA | 12 000 000 FCFA |
| 200 vendeurs    | 2 000 000 FCFA | 24 000 000 FCFA |

---

## 🛠️ SUPPORT & ÉVOLUTIONS FUTURES

Fonctionnalités à ajouter dans la v2 :
- Intégration paiement Orange Money API
- Application mobile React Native
- Notifications WhatsApp automatiques (Twilio)
- Rapport comptable mensuel PDF complet
- Multi-photos upload (Supabase Storage)

---

**DIAGOSO — La Maison du Commerce 🏪**
*Bamako, Mali*
