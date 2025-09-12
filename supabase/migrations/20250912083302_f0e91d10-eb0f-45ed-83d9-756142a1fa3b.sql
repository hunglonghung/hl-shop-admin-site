-- Add specifications column to products table
ALTER TABLE products ADD COLUMN specifications jsonb DEFAULT '{}'::jsonb;