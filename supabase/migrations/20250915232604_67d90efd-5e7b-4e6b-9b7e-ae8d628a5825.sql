-- Update products with price 579000 to authenticity_type '1:1'
UPDATE public.products 
SET authenticity_type = '1:1' 
WHERE price = 579000;

-- Update all other products to authenticity_type 'chính hãng'
UPDATE public.products 
SET authenticity_type = 'chính hãng' 
WHERE price != 579000;