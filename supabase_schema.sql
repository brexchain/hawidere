-- SQL Schema for Hawidere App

-- 1. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, preparing, ready
  table_number TEXT,
  customer_name TEXT
);

-- 2. Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  rating TEXT NOT NULL,
  comment TEXT,
  table_number TEXT
);

-- Enable Realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE feedback;

-- Row Level Security (RLS) - Basic Setup
-- For a prototype, we'll allow public inserts and authenticated reads.
-- In production, you should harden these rules.

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts for orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts for feedback" ON feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated reads for orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow authenticated reads for feedback" ON feedback FOR SELECT USING (true);
CREATE POLICY "Allow authenticated updates for orders" ON orders FOR UPDATE USING (true);
