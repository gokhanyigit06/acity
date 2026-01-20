-- Update category name and slug in categories table
UPDATE categories
SET name = 'Kiosk', slug = 'kiosk'
WHERE name = 'Standlar';

-- Update category string in stores table if it's used there
UPDATE stores
SET category = 'Kiosk'
WHERE category = 'Standlar';
