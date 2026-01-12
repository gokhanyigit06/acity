-- Create Store Categories Junction Table for Many-to-Many relationship
CREATE TABLE store_categories (
    store_id bigint REFERENCES stores(id) ON DELETE CASCADE,
    category_id bigint REFERENCES categories(id) ON DELETE CASCADE,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    PRIMARY KEY (store_id, category_id)
);

-- Migration script to move existing text categories to new structure (Best Effort)
-- This logic tries to find the category ID for the existing text category and insert into junction table
INSERT INTO store_categories (store_id, category_id)
SELECT s.id, c.id
FROM stores s
JOIN categories c ON s.category = c.name
ON CONFLICT DO NOTHING;

-- Optional: If you want to keep the old 'category' column as a primary/display category, we leave it.
-- If we wanted to fully migrate, we would drop it, but for compatibility let's keep it for now
-- and treat the new table as "All Categories".
