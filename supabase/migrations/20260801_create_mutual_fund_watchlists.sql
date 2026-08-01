-- Create mutual_fund_watchlists table
CREATE TABLE IF NOT EXISTS public.mutual_fund_watchlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    fund_code TEXT NOT NULL,
    fund_name TEXT NOT NULL,
    amc TEXT,
    category TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, fund_code)
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.mutual_fund_watchlists ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view their own mutual fund watchlists"
    ON public.mutual_fund_watchlists FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own mutual fund watchlists"
    ON public.mutual_fund_watchlists FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mutual fund watchlists"
    ON public.mutual_fund_watchlists FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mutual fund watchlists"
    ON public.mutual_fund_watchlists FOR DELETE
    USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Check if trigger already exists (safe creation)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'set_mutual_fund_watchlists_updated_at'
    ) THEN
        CREATE TRIGGER set_mutual_fund_watchlists_updated_at
            BEFORE UPDATE ON public.mutual_fund_watchlists
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_updated_at();
    END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS mutual_fund_watchlists_user_id_idx ON public.mutual_fund_watchlists (user_id);
CREATE INDEX IF NOT EXISTS mutual_fund_watchlists_fund_code_idx ON public.mutual_fund_watchlists (fund_code);
