-- Create a combo product that references existing products
DO $$
DECLARE
    boots_id uuid;
    ball_id uuid;
    jersey_id uuid;
BEGIN
    -- Get product IDs
    SELECT id INTO boots_id FROM products WHERE name = 'Adidas Predator Elite';
    SELECT id INTO ball_id FROM products WHERE name = 'FIFA World Cup 2024 Ball';
    SELECT id INTO jersey_id FROM products WHERE name = 'Manchester United Home Jersey';
    
    -- Insert combo product
    INSERT INTO products (name, description, category, subcategory, price, brand, authenticity_type, is_combo, combo_products, discount_percentage, discounted_price, image_url) 
    VALUES (
        'Football Starter Kit', 
        'Complete football starter kit with Adidas Predator Elite boots, FIFA World Cup ball, and Manchester United jersey', 
        'Football', 
        'Training Equipment', 
        6000000, 
        'Adidas', 
        'authentic', 
        true, 
        ARRAY[boots_id, ball_id, jersey_id], 
        25, 
        4500000, 
        'football-kit.jpg'
    );
END $$;