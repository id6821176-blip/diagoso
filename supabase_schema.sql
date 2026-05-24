-- ============================================
-- DIAGOSO - Schéma Base de Données Supabase
-- "La Maison du Commerce" - Mali
-- ============================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: profiles (vendeurs + admin)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  shop_name TEXT,
  shop_description TEXT,
  shop_logo_url TEXT,
  shop_banner_url TEXT,
  shop_slug TEXT UNIQUE,
  city TEXT DEFAULT 'Bamako',
  role TEXT DEFAULT 'vendor' CHECK (role IN ('vendor', 'admin')),
  theme TEXT DEFAULT 'green' CHECK (theme IN ('green', 'orange', 'blue', 'red', 'purple')),
  language TEXT DEFAULT 'fr' CHECK (language IN ('fr', 'bm', 'ar')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'pending', 'trial')),
  subscription_accepted BOOLEAN DEFAULT false,
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: products (catalogue produits)
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,0) NOT NULL,
  compare_price DECIMAL(12,0),
  stock_quantity INTEGER DEFAULT 0,
  stock_alert_at INTEGER DEFAULT 5,
  category TEXT,
  images TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  total_sold INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: orders (commandes)
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  vendor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  customer_city TEXT DEFAULT 'Bamako',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'orange_money', 'wave', 'moov_money')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  subtotal DECIMAL(12,0) NOT NULL,
  delivery_fee DECIMAL(12,0) DEFAULT 0,
  total DECIMAL(12,0) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: order_items (lignes de commande)
-- ============================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_price DECIMAL(12,0) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  subtotal DECIMAL(12,0) NOT NULL
);

-- ============================================
-- TABLE: invoices (factures abonnement)
-- ============================================
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  vendor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(12,0) DEFAULT 10000,
  currency TEXT DEFAULT 'FCFA',
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  paid_at TIMESTAMPTZ,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: notifications
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'order', 'payment')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: platform_settings (config admin)
-- ============================================
CREATE TABLE platform_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DONNÉES INITIALES
-- ============================================
INSERT INTO platform_settings (key, value, description) VALUES
  ('monthly_subscription_fee', '10000', 'Frais abonnement mensuel en FCFA'),
  ('platform_name', 'DIAGOSO', 'Nom de la plateforme'),
  ('trial_days', '30', 'Jours d''essai gratuit'),
  ('whatsapp_enabled', 'true', 'Activation messages WhatsApp automatiques'),
  ('maintenance_mode', 'false', 'Mode maintenance');

-- ============================================
-- FONCTIONS & TRIGGERS
-- ============================================

-- Trigger: mise à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Fonction: générer numéro de commande
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'DGS-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 9999)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Fonction: générer numéro de facture
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'INV-' || TO_CHAR(NOW(), 'YYYYMM') || '-' || LPAD(FLOOR(RANDOM() * 9999)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: chaque vendeur voit son propre profil, admin voit tout
CREATE POLICY "vendor_own_profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "admin_all_profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Produits: vendeur gère ses produits, public peut lire les produits actifs
CREATE POLICY "vendor_own_products" ON products FOR ALL USING (vendor_id = auth.uid());
CREATE POLICY "public_active_products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Commandes: vendeur voit ses commandes
CREATE POLICY "vendor_own_orders" ON orders FOR ALL USING (vendor_id = auth.uid());
CREATE POLICY "admin_all_orders" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Factures: vendeur voit ses factures
CREATE POLICY "vendor_own_invoices" ON invoices FOR SELECT USING (vendor_id = auth.uid());
CREATE POLICY "admin_all_invoices" ON invoices FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Notifications: chaque vendeur ses notifs
CREATE POLICY "vendor_own_notifications" ON notifications FOR ALL USING (vendor_id = auth.uid());

-- ============================================
-- INDEX PERFORMANCES
-- ============================================
CREATE INDEX idx_products_vendor ON products(vendor_id);
CREATE INDEX idx_orders_vendor ON orders(vendor_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_invoices_vendor ON invoices(vendor_id);
CREATE INDEX idx_notifications_vendor ON notifications(vendor_id, is_read);
