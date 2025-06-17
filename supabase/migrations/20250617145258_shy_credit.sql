/*
  # Create marketplace tables for carbon credits

  1. New Tables
    - `carbon_credits`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text)
      - `price` (decimal, not null)
      - `quantity` (integer, not null)
      - `project_name` (text, not null)
      - `location` (text, not null)
      - `certification_body` (text, not null)
      - `vintage` (text, not null)
      - `image_url` (text)
      - `seller` (text)
      - `carbon_reduction` (decimal, not null)
      - `expiry_date` (date)
      - `category` (text, not null)
      - `status` (text, default: 'available')
      - `created_at` (timestamptz, default: now())
      - `updated_at` (timestamptz, default: now())

    - `user_carbon_credits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `credit_id` (uuid, references carbon_credits.id)
      - `quantity` (integer, not null)
      - `purchase_price` (decimal, not null)
      - `purchased_at` (timestamptz, default: now())

    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `credit_id` (uuid, references carbon_credits.id)
      - `type` (text, not null) -- 'buy' or 'sell'
      - `quantity` (integer, not null)
      - `price` (decimal, not null)
      - `total_amount` (decimal, not null)
      - `status` (text, default: 'completed')
      - `tx_hash` (text)
      - `created_at` (timestamptz, default: now())

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Create carbon_credits table
CREATE TABLE IF NOT EXISTS carbon_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  project_name TEXT NOT NULL,
  location TEXT NOT NULL,
  certification_body TEXT NOT NULL,
  vintage TEXT NOT NULL,
  image_url TEXT,
  seller TEXT,
  carbon_reduction DECIMAL(10,2) NOT NULL,
  expiry_date DATE,
  category TEXT NOT NULL CHECK (category IN ('renewable', 'forestry', 'agriculture', 'waste', 'other')),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'pending')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_carbon_credits table
CREATE TABLE IF NOT EXISTS user_carbon_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  credit_id UUID NOT NULL REFERENCES carbon_credits(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  purchase_price DECIMAL(10,2) NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, credit_id)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  credit_id UUID NOT NULL REFERENCES carbon_credits(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
  tx_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE carbon_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_carbon_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies for carbon_credits (public read, admin write)
CREATE POLICY "Anyone can view carbon credits"
  ON carbon_credits
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert carbon credits"
  ON carbon_credits
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own carbon credits"
  ON carbon_credits
  FOR UPDATE
  TO authenticated
  USING (seller = auth.jwt() ->> 'email');

-- Policies for user_carbon_credits
CREATE POLICY "Users can view their own carbon credits"
  ON user_carbon_credits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own carbon credits"
  ON user_carbon_credits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own carbon credits"
  ON user_carbon_credits
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert sample data
INSERT INTO carbon_credits (name, description, price, quantity, project_name, location, certification_body, vintage, image_url, seller, carbon_reduction, category) VALUES
('Amazon Rainforest Conservation', 'Carbon credits from protecting the Amazon rainforest from deforestation.', 15.50, 1000, 'Amazon Preservation Initiative', 'Brazil', 'Verra', '2024', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2072&auto=format&fit=crop', '0x1234...5678', 1000, 'forestry'),
('Wind Farm Project', 'Credits generated from a wind farm project reducing fossil fuel dependency.', 12.75, 500, 'Clean Wind Energy', 'Germany', 'Gold Standard', '2023', 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2070&auto=format&fit=crop', '0x9876...4321', 500, 'renewable'),
('Sustainable Agriculture', 'Carbon sequestration through sustainable farming practices.', 18.25, 750, 'Green Farming Initiative', 'India', 'Climate Action Reserve', '2024', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop', '0xabcd...efgh', 750, 'agriculture'),
('Methane Capture Project', 'Capturing methane emissions from waste management facilities.', 20.00, 300, 'Waste to Energy', 'United States', 'American Carbon Registry', '2023', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop', '0xijkl...mnop', 300, 'waste'),
('Solar Power Plant', 'Credits from a large-scale solar power installation.', 14.50, 1200, 'Solar Energy Solutions', 'Australia', 'Verra', '2024', 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2072&auto=format&fit=crop', '0xqrst...uvwx', 1200, 'renewable'),
('Mangrove Restoration', 'Restoring mangrove ecosystems for carbon sequestration and coastal protection.', 22.75, 600, 'Coastal Ecosystem Restoration', 'Indonesia', 'Plan Vivo', '2023', 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?q=80&w=2071&auto=format&fit=crop', '0xyzab...cdef', 600, 'forestry');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_carbon_credits_updated_at BEFORE UPDATE ON carbon_credits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();