
-- Normalize Floor Names to Standard Format

-- 1. Normalize 'Kat 1' -> '1. Kat'
UPDATE stores SET floor = '1. Kat' WHERE floor = 'Kat 1';

-- 2. Normalize 'Kat 2' -> '2. Kat'
UPDATE stores SET floor = '2. Kat' WHERE floor = 'Kat 2';

-- 3. Normalize 'Kat -1' and '1. Alt Kat' -> '-1. Kat'
UPDATE stores SET floor = '-1. Kat' WHERE floor IN ('Kat -1', '1. Alt Kat');

-- 4. Normalize 'Kat -2', 'Kat-2', '2. Alt Kat' -> '-2. Kat'
UPDATE stores SET floor = '-2. Kat' WHERE floor IN ('Kat -2', 'Kat-2', '2. Alt Kat');

-- 5. Normalize 'Zemin' -> 'Zemin Kat' (just in case, though stats showed mostly Zemin Kat)
UPDATE stores SET floor = 'Zemin Kat' WHERE floor = 'Zemin';
