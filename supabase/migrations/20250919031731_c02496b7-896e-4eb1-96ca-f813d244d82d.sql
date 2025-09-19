-- Add Joola authentic table tennis products
INSERT INTO public.products (name, brand, category, subcategory, description, price, discounted_price, authenticity_type, image_url)
VALUES 
-- Joola table tennis paddles
('Joola Competition Pro', 'Joola', 'Table Tennis', 'Rackets', 'Professional table tennis paddle for competitive play', 890000, 890000, 'chính hãng', 'https://example.com/joola-competition-pro.jpg'),
('Joola Match Pro 4-Star', 'Joola', 'Table Tennis', 'Rackets', 'ITTF approved 4-star professional racket', 650000, 650000, 'chính hãng', 'https://example.com/joola-match-pro.jpg'),
('Joola Training Pro', 'Joola', 'Table Tennis', 'Rackets', 'Training paddle for intermediate players', 450000, 450000, 'chính hãng', 'https://example.com/joola-training-pro.jpg'),

-- Facolos pickleball balls
('Facolos F-Pro Performance Ball (Pack of 3)', 'Facolos', 'Pickleball', 'Balls', 'High-performance pickleball balls for professional play', 420000, 420000, 'chính hãng', 'https://example.com/facolos-fpro-ball.jpg'),
('Facolos Competition Ball (Pack of 6)', 'Facolos', 'Pickleball', 'Balls', 'Tournament-grade pickleball balls', 780000, 780000, 'chính hãng', 'https://example.com/facolos-competition-ball.jpg'),
('Facolos Training Ball (Pack of 12)', 'Facolos', 'Pickleball', 'Balls', 'Durable training balls for practice sessions', 950000, 950000, 'chính hãng', 'https://example.com/facolos-training-ball.jpg');