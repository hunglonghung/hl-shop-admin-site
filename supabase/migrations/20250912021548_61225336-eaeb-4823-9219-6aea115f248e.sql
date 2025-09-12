-- First drop the generated column if it exists
ALTER TABLE public.products DROP COLUMN IF EXISTS discounted_price;

-- Add missing columns to products table with correct types
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS brand text,
ADD COLUMN IF NOT EXISTS additional_images text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS authenticity_type text DEFAULT 'authentic',
ADD COLUMN IF NOT EXISTS combo_products uuid[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS discount_percentage numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_combo boolean DEFAULT false;

-- Add discounted_price as a regular numeric column (not generated)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS discounted_price numeric;

-- Create brands table if it doesn't exist  
CREATE TABLE IF NOT EXISTS public.brands (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  logo_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on brands table
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for brands
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'brands' 
        AND policyname = 'Brands are viewable by everyone'
    ) THEN
        CREATE POLICY "Brands are viewable by everyone" 
        ON public.brands FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'brands' 
        AND policyname = 'Anyone can manage brands'
    ) THEN
        CREATE POLICY "Anyone can manage brands" 
        ON public.brands FOR ALL USING (true);
    END IF;
END $$;

-- Create trigger for brands updated_at
DROP TRIGGER IF EXISTS update_brands_updated_at ON public.brands;
CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON public.brands
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();