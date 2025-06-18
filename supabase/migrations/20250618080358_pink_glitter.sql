/*
  # Add database functions for carbon credit operations

  1. New Functions
    - `decrement_credit_quantity` - Safely decrement carbon credit quantity
    - `get_available_credits` - Get only available credits with proper filtering
  
  2. Security
    - Functions use security definer for proper access
    - Proper validation and error handling
*/

-- Function to safely decrement carbon credit quantity
CREATE OR REPLACE FUNCTION decrement_credit_quantity(
  credit_id UUID,
  decrement_amount INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE carbon_credits 
  SET quantity = quantity - decrement_amount,
      updated_at = now()
  WHERE id = credit_id 
    AND quantity >= decrement_amount;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient credit quantity or credit not found';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get available credits with filtering
CREATE OR REPLACE FUNCTION get_available_credits(
  filter_category TEXT DEFAULT NULL,
  filter_min_price DECIMAL DEFAULT NULL,
  filter_max_price DECIMAL DEFAULT NULL,
  filter_location TEXT DEFAULT NULL,
  filter_vintage TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  price DECIMAL,
  quantity INTEGER,
  project_name TEXT,
  location TEXT,
  certification_body TEXT,
  vintage TEXT,
  image_url TEXT,
  seller TEXT,
  carbon_reduction DECIMAL,
  expiry_date DATE,
  category TEXT,
  status TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cc.id,
    cc.name,
    cc.description,
    cc.price,
    cc.quantity,
    cc.project_name,
    cc.location,
    cc.certification_body,
    cc.vintage,
    cc.image_url,
    cc.seller,
    cc.carbon_reduction,
    cc.expiry_date,
    cc.category,
    cc.status,
    cc.created_at,
    cc.updated_at
  FROM carbon_credits cc
  WHERE cc.status = 'available'
    AND cc.quantity > 0
    AND (filter_category IS NULL OR cc.category = filter_category)
    AND (filter_min_price IS NULL OR cc.price >= filter_min_price)
    AND (filter_max_price IS NULL OR cc.price <= filter_max_price)
    AND (filter_location IS NULL OR cc.location = filter_location)
    AND (filter_vintage IS NULL OR cc.vintage = filter_vintage)
  ORDER BY cc.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;