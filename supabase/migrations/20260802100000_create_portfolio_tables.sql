-- Create portfolio_holdings table
CREATE TABLE IF NOT EXISTS portfolio_holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  company_name TEXT NOT NULL,
  quantity NUMERIC NOT NULL CHECK (quantity >= 0),
  average_buy_price NUMERIC NOT NULL CHECK (average_buy_price >= 0),
  current_price NUMERIC NOT NULL CHECK (current_price >= 0),
  market_value NUMERIC NOT NULL CHECK (market_value >= 0),
  asset_type TEXT NOT NULL,
  exchange TEXT,
  currency TEXT DEFAULT 'USD',
  sector TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create portfolio_transactions table
CREATE TABLE IF NOT EXISTS portfolio_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES portfolio_holdings(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('buy', 'sell', 'dividend', 'bonus', 'split', 'ipo')),
  quantity NUMERIC NOT NULL,
  price NUMERIC NOT NULL,
  fees NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create portfolio_goals table
CREATE TABLE IF NOT EXISTS portfolio_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_amount NUMERIC NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC NOT NULL DEFAULT 0,
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_portfolio_holdings_user_id ON portfolio_holdings(user_id);
CREATE INDEX idx_portfolio_holdings_ticker ON portfolio_holdings(ticker);
CREATE INDEX idx_portfolio_transactions_portfolio_id ON portfolio_transactions(portfolio_id);
CREATE INDEX idx_portfolio_goals_user_id ON portfolio_goals(user_id);

-- Enable RLS
ALTER TABLE portfolio_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for portfolio_holdings
CREATE POLICY "Users can view their own holdings"
  ON portfolio_holdings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own holdings"
  ON portfolio_holdings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own holdings"
  ON portfolio_holdings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own holdings"
  ON portfolio_holdings FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for portfolio_transactions
CREATE POLICY "Users can view their own transactions"
  ON portfolio_transactions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM portfolio_holdings h 
    WHERE h.id = portfolio_transactions.portfolio_id AND h.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own transactions"
  ON portfolio_transactions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM portfolio_holdings h 
    WHERE h.id = portfolio_transactions.portfolio_id AND h.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own transactions"
  ON portfolio_transactions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM portfolio_holdings h 
    WHERE h.id = portfolio_transactions.portfolio_id AND h.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own transactions"
  ON portfolio_transactions FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM portfolio_holdings h 
    WHERE h.id = portfolio_transactions.portfolio_id AND h.user_id = auth.uid()
  ));

-- RLS Policies for portfolio_goals
CREATE POLICY "Users can view their own goals"
  ON portfolio_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
  ON portfolio_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON portfolio_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
  ON portfolio_goals FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_portfolio_holdings_updated_at') THEN
        CREATE TRIGGER update_portfolio_holdings_updated_at
            BEFORE UPDATE ON portfolio_holdings
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_portfolio_goals_updated_at') THEN
        CREATE TRIGGER update_portfolio_goals_updated_at
            BEFORE UPDATE ON portfolio_goals
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
