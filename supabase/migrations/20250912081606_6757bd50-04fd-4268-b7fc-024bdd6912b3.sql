-- Clear all existing products and categories
DELETE FROM products;
DELETE FROM categories;

-- Create comprehensive sports categories with subcategories
INSERT INTO categories (name, subcategories) VALUES 
('Football', ARRAY['Balls', 'Boots', 'Jerseys', 'Shin Guards', 'Training Equipment']),
('Basketball', ARRAY['Balls', 'Shoes', 'Jerseys', 'Hoops', 'Training Aids']),
('Tennis', ARRAY['Rackets', 'Balls', 'Shoes', 'Apparel', 'Strings']),
('Badminton', ARRAY['Rackets', 'Shuttlecocks', 'Shoes', 'Strings', 'Bags']),
('Table Tennis', ARRAY['Paddles', 'Balls', 'Tables', 'Nets', 'Rubber Sheets']),
('Running', ARRAY['Shoes', 'Apparel', 'Watches', 'Accessories', 'Nutrition']),
('Swimming', ARRAY['Swimwear', 'Goggles', 'Caps', 'Training Equipment', 'Accessories']),
('Volleyball', ARRAY['Balls', 'Nets', 'Shoes', 'Knee Pads', 'Apparel']),
('Golf', ARRAY['Clubs', 'Balls', 'Bags', 'Apparel', 'Accessories']),
('Cycling', ARRAY['Bikes', 'Helmets', 'Apparel', 'Accessories', 'Parts']);

-- Insert sample brands
INSERT INTO brands (name, logo_url) VALUES 
('Adidas', 'https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png'),
('Nike', 'https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png'),
('Puma', 'https://logos-world.net/wp-content/uploads/2020/04/Puma-Logo.png'),
('Wilson', 'https://logos-world.net/wp-content/uploads/2020/06/Wilson-Logo.png'),
('Yonex', 'https://www.yonex.com/media/wysiwyg/logo.png'),
('Victor', 'https://www.victor-sport.com/images/logo.png'),
('Mizuno', 'https://logos-world.net/wp-content/uploads/2020/06/Mizuno-Logo.png'),
('Asics', 'https://logos-world.net/wp-content/uploads/2020/04/ASICS-Logo.png');