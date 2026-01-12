
-- 1. Create Categories if not exist
INSERT INTO categories (name, slug)
SELECT 'Hizmet', 'hizmet'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Hizmet');

INSERT INTO categories (name, slug)
SELECT 'Giyim & Moda', 'giyim-moda'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Giyim & Moda');

INSERT INTO categories (name, slug)
SELECT 'Ev & Mobilya', 'ev-mobilya'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Ev & Mobilya');

INSERT INTO categories (name, slug)
SELECT 'Eğlence', 'eglence'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Eğlence');

INSERT INTO categories (name, slug)
SELECT 'Cafe & Restorant', 'cafe-restorant'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Cafe & Restorant');

-- 2. Insert Missing Stores
-- We use DO block to perform logic
DO $$
DECLARE
    service_id INT;
    clothing_id INT;
    home_id INT;
    dining_id INT;
    fun_id INT;
    
    new_store_id INT;
    store_record RECORD;
BEGIN
    -- Get Category IDs
    SELECT id INTO service_id FROM categories WHERE name IN ('Hizmet', 'Bankalar') LIMIT 1;
    -- Fallback for service if 'Hizmet' not found, create or pick logic handled above
    IF service_id IS NULL THEN SELECT id INTO service_id FROM categories WHERE name = 'Hizmet'; END IF;
    
    SELECT id INTO clothing_id FROM categories WHERE name = 'Giyim & Moda' LIMIT 1;
    SELECT id INTO home_id FROM categories WHERE name = 'Ev & Mobilya' LIMIT 1;
    SELECT id INTO dining_id FROM categories WHERE name = 'Cafe & Restorant' LIMIT 1;
    SELECT id INTO fun_id FROM categories WHERE name = 'Eğlence' LIMIT 1;

    -- Define missing stores with their categories and floors (Defaulting floor to 'Zemin Kat' for banks if unknown)
    -- Format: Name, CategoryId, Floor
    FOR store_record IN SELECT * FROM (VALUES 
        ('Akbank', service_id, 'Zemin Kat'),
        ('Albaraka', service_id, 'Zemin Kat'),
        ('Garanti Bankası', service_id, 'Zemin Kat'),
        ('Halkbank', service_id, 'Zemin Kat'),
        ('HSBC', service_id, 'Zemin Kat'),
        ('ING', service_id, 'Zemin Kat'),
        ('İş Bankası', service_id, 'Zemin Kat'),
        ('QNB', service_id, 'Zemin Kat'),
        ('TEB', service_id, 'Zemin Kat'),
        ('Vakıfbank', service_id, 'Zemin Kat'),
        ('Ziraat Bankası', service_id, 'Zemin Kat'),
        ('Berk Kuyumculuk', service_id, 'Zemin Kat'),
        ('Tuğra Gümüş & Tesbih', service_id, 'Zemin Kat'),
        ('I Think Hardware', service_id, 'Zemin Kat'),
        ('Entertainment Electronics', service_id, 'Zemin Kat'),
        
        ('Aura', clothing_id, '1. Alt Kat'),
        ('Benetton', clothing_id, '1. Alt Kat'),
        ('Moa IGL', clothing_id, '1. Kat'),
        ('Prestij Aksesuar', clothing_id, '1. Kat'),
        ('Haribo Kiosk', clothing_id, '1. Kat'),

        ('Baransu Yatak', home_id, '2. Alt Kat'),
        ('Karaca Porselen', home_id, '2. Alt Kat'),
        ('Marka', home_id, '2. Alt Kat'),
        ('Taç Züccaciye', home_id, '2. Alt Kat'),
        ('Zenora Mobilya', home_id, '2. Alt Kat'),
        ('KRC Züccaciye', home_id, 'Zemin Kat'),

        ('Coffee Di', dining_id, 'Zemin Kat'),
        ('Cozy Cart’s', dining_id, 'Zemin Kat'),
        ('Popeyes', dining_id, '2. Kat'),

        ('Atış Poligonu', fun_id, '2. Kat'),
        ('Cinema', fun_id, '2. Kat'),
        ('Çocuk Atölye', fun_id, '2. Kat'),
        ('Korku Evi', fun_id, '2. Kat'),
        ('Softplay', fun_id, '2. Kat'),
        ('TTO Kozmetik', fun_id, '2. Kat')

    ) AS t(name, cat_id, floor)
    LOOP
        -- Check if store exists (fuzzy match could be done but here strict name check)
        IF NOT EXISTS (SELECT 1 FROM stores WHERE lower(name) = lower(store_record.name)) THEN
            
            INSERT INTO stores (name, slug, category, floor, created_at)
            VALUES (
                store_record.name,
                lower(regexp_replace(store_record.name, '[^a-zA-Z0-9]', '-', 'g')), -- simple slug
                (SELECT name FROM categories WHERE id = store_record.cat_id), -- textual category fallback
                store_record.floor,
                NOW()
            )
            RETURNING id INTO new_store_id;

            -- Link to category
            IF store_record.cat_id IS NOT NULL THEN
                INSERT INTO store_categories (store_id, category_id)
                VALUES (new_store_id, store_record.cat_id);
            END IF;
            
        END IF;
    END LOOP;
END $$;
