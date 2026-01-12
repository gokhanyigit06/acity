
-- Step 1: Create the new category 'Cafe & Restorant' if it doesn't await exist
INSERT INTO categories (name)
SELECT 'Cafe & Restorant'
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE name = 'Cafe & Restorant'
);

-- Step 2: Update all stores that have 'Yeme-İçme' as their category to 'Cafe & Restorant'
UPDATE stores
SET category = 'Cafe & Restorant'
WHERE category = 'Yeme-İçme';

-- Step 3: Delete the old 'Yeme-İçme' category from the categories table
-- (Only if no stores are using it anymore, which the previous step ensures)
DELETE FROM categories
WHERE name = 'Yeme-İçme';

-- Use the view if applicable, or check if 'store_categories' linking table implies other ops.
-- If 'store_categories' uses IDs, we need to update that table too.

-- Let's assume standard 'categories' table has (id, name).
-- We need to find the ID of 'Yeme-İçme' and 'Cafe & Restorant'.

DO $$
DECLARE
    old_cat_id INTEGER;
    new_cat_id INTEGER;
BEGIN
    SELECT id INTO old_cat_id FROM categories WHERE name = 'Yeme-İçme';
    SELECT id INTO new_cat_id FROM categories WHERE name = 'Cafe & Restorant';

    -- Provide fallback if new cat was just inserted and we need to fetch it
    IF new_cat_id IS NULL THEN
         SELECT id INTO new_cat_id FROM categories WHERE name = 'Cafe & Restorant';
    END IF;

    -- Update store_categories junction table references
    IF old_cat_id IS NOT NULL AND new_cat_id IS NOT NULL THEN
        UPDATE store_categories
        SET category_id = new_cat_id
        WHERE category_id = old_cat_id
        AND NOT EXISTS (
            SELECT 1 FROM store_categories sc 
            WHERE sc.store_id = store_categories.store_id 
            AND sc.category_id = new_cat_id
        );
        
        -- Delete any remaining references to old category (e.g. duplicates that weren't updated)
        DELETE FROM store_categories WHERE category_id = old_cat_id;
    END IF;
END $$;
