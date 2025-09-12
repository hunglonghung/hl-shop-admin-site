-- Insert sample products with brands, discounts, and different authenticity types
INSERT INTO products (name, description, category, subcategory, price, brand, authenticity_type, discount_percentage, discounted_price, image_url) VALUES 

-- Football products
('Adidas Predator Elite', 'Professional football boots with precision strike technology', 'Football', 'Boots', 3500000, 'Adidas', 'authentic', 15, 2975000, 'football-boots.jpg'),
('Nike Mercurial Superfly REP', 'High-quality replica of Nike Mercurial boots', 'Football', 'Boots', 800000, 'Nike', 'rep_1_1', 0, NULL, 'nike-mercurial.jpg'),
('FIFA World Cup 2024 Ball', 'Official match ball for FIFA World Cup 2024', 'Football', 'Balls', 2200000, 'Adidas', 'authentic', 10, 1980000, 'fifa-ball.jpg'),
('Manchester United Home Jersey', 'Official Manchester United home jersey 2024/25', 'Football', 'Jerseys', 1800000, 'Adidas', 'authentic', 0, NULL, 'mu-jersey.jpg'),

-- Basketball products  
('Nike Air Jordan XXXVIII', 'Latest Air Jordan basketball shoes with Zoom Air', 'Basketball', 'Shoes', 5200000, 'Nike', 'authentic', 20, 4160000, 'jordan-38.jpg'),
('Wilson Evolution Basketball', 'Official game ball used in many professional leagues', 'Basketball', 'Balls', 1500000, 'Wilson', 'authentic', 0, NULL, 'wilson-ball.jpg'),
('Lakers Jersey REP', 'High-quality replica of Lakers jersey', 'Basketball', 'Jerseys', 450000, 'Nike', 'rep_1_1', 0, NULL, 'lakers-jersey.jpg'),

-- Tennis products
('Wilson Pro Staff RF97', 'Roger Federer signature tennis racket', 'Tennis', 'Rackets', 6800000, 'Wilson', 'authentic', 12, 5984000, 'wilson-racket.jpg'),
('Nike Court Air Zoom Vapor', 'Professional tennis shoes for all court surfaces', 'Tennis', 'Shoes', 3200000, 'Nike', 'authentic', 0, NULL, 'tennis-shoes.jpg'),
('Wilson Championship Tennis Balls', 'Premium tennis balls for tournament play', 'Tennis', 'Balls', 280000, 'Wilson', 'authentic', 0, NULL, 'tennis-balls.jpg'),

-- Badminton products
('Yonex Arcsaber 11', 'Professional badminton racket with precision and power', 'Badminton', 'Rackets', 4200000, 'Yonex', 'authentic', 8, 3864000, 'yonex-racket.jpg'),
('Victor SH-A922', 'Professional badminton shoes with advanced cushioning', 'Badminton', 'Shoes', 2800000, 'Victor', 'authentic', 0, NULL, 'victor-shoes.jpg'),
('Yonex AS-50 Shuttlecocks', 'Tournament grade feather shuttlecocks', 'Badminton', 'Shuttlecocks', 650000, 'Yonex', 'authentic', 0, NULL, 'shuttlecocks.jpg'),

-- Table Tennis products  
('Butterfly Timo Boll ALC', 'Professional table tennis blade used by Timo Boll', 'Table Tennis', 'Paddles', 3800000, 'Butterfly', 'authentic', 15, 3230000, 'butterfly-paddle.jpg'),
('DHS 3-Star Balls', 'ITTF approved 3-star table tennis balls', 'Table Tennis', 'Balls', 320000, 'DHS', 'authentic', 0, NULL, 'dhs-balls.jpg'),

-- Running products
('Nike Air Zoom Pegasus 40', 'Versatile running shoes for daily training', 'Running', 'Shoes', 3600000, 'Nike', 'authentic', 18, 2952000, 'pegasus-40.jpg'),
('Asics Gel-Kayano 30', 'Premium stability running shoes', 'Running', 'Shoes', 4200000, 'Asics', 'authentic', 0, NULL, 'gel-kayano.jpg'),
('Garmin Forerunner 265', 'Advanced GPS running watch', 'Running', 'Watches', 8500000, 'Garmin', 'authentic', 5, 8075000, 'garmin-watch.jpg'),

-- Swimming products
('Speedo Fastskin LZR', 'Professional racing swimsuit', 'Swimming', 'Swimwear', 4500000, 'Speedo', 'authentic', 10, 4050000, 'speedo-suit.jpg'),
('Arena Cobra Ultra Goggles', 'High-performance swimming goggles', 'Swimming', 'Goggles', 850000, 'Arena', 'authentic', 0, NULL, 'arena-goggles.jpg');