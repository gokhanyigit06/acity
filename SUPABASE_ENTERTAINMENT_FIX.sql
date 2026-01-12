-- Upsert Entertainment spots (Update if exists, Insert if new)
INSERT INTO stores (name, slug, category, floor, website_url) VALUES
('CİNEVİZYON', 'cinevizyon', 'Eğlence', 'Kat 2', 'https://acity.com.tr/entertainment'),
('EZEL BALON EVİ', 'ezel-balon-evi', 'Eğlence', 'Kat 2', 'https://acity.com.tr/entertainment'),
('EĞLENCE ADASI', 'eglence-adasi', 'Eğlence', 'Kat 2', 'https://acity.com.tr/entertainment'),
('ADELAND ÇOCUK OYUN EVİ', 'adeland-cocuk-oyun-evi', 'Eğlence', 'Kat 2', 'https://acity.com.tr/entertainment'),
('ARENA TRAMBOLİN', 'arena-trambolin', 'Eğlence', 'Kat 2', 'https://acity.com.tr/entertainment'),
('KUMPANYA KUM HAVUZU', 'kumpanya-kum-havuzu', 'Eğlence', 'Kat 2', 'https://acity.com.tr/entertainment')
ON CONFLICT (slug) 
DO UPDATE SET 
    category = EXCLUDED.category,
    floor = EXCLUDED.floor;
