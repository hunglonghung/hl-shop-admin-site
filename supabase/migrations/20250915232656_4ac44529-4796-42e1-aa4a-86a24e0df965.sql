-- Drop the existing check constraint if it exists
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_authenticity_type_check;

-- Add a new check constraint that allows both values
ALTER TABLE public.products ADD CONSTRAINT products_authenticity_type_check 
CHECK (authenticity_type IN ('authentic', 'chính hãng', '1:1'));

-- Update products with price 579000 to authenticity_type '1:1'
UPDATE public.products 
SET authenticity_type = '1:1' 
WHERE price = 579000;

-- Update all other products to authenticity_type 'chính hãng'
UPDATE public.products 
SET authenticity_type = 'chính hãng' 
WHERE price != 579000;