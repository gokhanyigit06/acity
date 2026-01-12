
-- Step 1: Create the new category 'Cafe & Restorant' with a slug
INSERT INTO categories (name, slug)
SELECT 'Cafe & Restorant', 'cafe-restorant'
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE name = 'Cafe & Restorant'
);

-- Step 2: Update all stores that have 'Yeme-İçme' as their category to 'Cafe & Restorant'
UPDATE stores
SET category = 'Cafe & Restorant'
WHERE category = 'Yeme-İçme';

-- Step 3: Handle the junction table (store_categories)
-- We need to act carefully here to avoid violating foreign key constraints before we delete the old category.

DO $$
DECLARE
    old_cat_id INTEGER;
    new_cat_id INTEGER;
BEGIN
    -- Get IDs
    SELECT id INTO old_cat_id FROM categories WHERE name = 'Yeme-İçme';
    SELECT id INTO new_cat_id FROM categories WHERE name = 'Cafe & Restorant';

    -- Only proceed if we have both IDs (old might be missing if already deleted)
    IF old_cat_id IS NOT NULL AND new_cat_id IS NOT NULL THEN
        
        -- Update existing relationships to point to the new category
        -- We use ON CONFLICT DO NOTHING logic by checking existence first to avoid duplicates
        UPDATE store_categories
        SET category_id = new_cat_id
        WHERE category_id = old_cat_id
        AND NOT EXISTS (
            SELECT 1 FROM store_categories sc_existing 
            WHERE sc_existing.store_id = store_categories.store_id 
            AND sc_existing.category_id = new_cat_id
        );

        -- Delete any remaining old relationships (these would be duplicates that we didn't update)
        DELETE FROM store_categories WHERE category_id = old_cat_id;
        
    END IF;
END $$;

-- Step 4: Now it is safe to delete the old category
DELETE FROM categories
WHERE name = 'Yeme-İçme';
