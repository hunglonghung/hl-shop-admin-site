-- Update all products with price 579000 to 599000
UPDATE public.products 
SET price = 599000, discounted_price = 599000
WHERE price = 579000;