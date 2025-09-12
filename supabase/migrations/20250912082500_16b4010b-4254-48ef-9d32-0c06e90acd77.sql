-- Clear existing categories and create the 3 Vietnamese categories
DELETE FROM categories;

-- Create the 3 main categories with Vietnamese subcategories
INSERT INTO categories (name, subcategories) VALUES 
('Pickleball', ARRAY['Vợt Pickleball', 'Balo Pickleball', 'Bóng Pickleball', 'Giày Pickleball', 'Phụ kiện Pickleball']),
('Bóng đá', ARRAY['Giày bóng đá', 'Áo đấu bóng đá', 'Bóng đá', 'Găng tay thủ môn', 'Dụng cụ bóng đá']),
('Cầu lông', ARRAY['Vợt cầu lông', 'Cầu lông', 'Giày cầu lông', 'Túi vợt cầu lông', 'Dây vợt cầu lông']);