-- Create Site Settings Table
CREATE TABLE site_settings (
    key text PRIMARY KEY,
    label text NOT NULL,
    value jsonb NOT NULL,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Initial Data (Migrating from current hardcoded values)

-- 1. Hero Section
INSERT INTO site_settings (key, label, value) VALUES
('hero_section', 'Ana Sayfa Banner', '{
    "mediaType": "video",
    "mediaUrl": "https://cdn.pixabay.com/video/2024/02/09/199958-911694865_large.mp4",
    "title": "ACITY''DE HAYAT",
    "subtitle": "ALIŞVERİŞİN, LEZZETİN VE EĞLENCENİN MERKEZİ"
}');

-- 2. Mega Menu - Cafe
INSERT INTO site_settings (key, label, value) VALUES
('mega_menu_cafe', 'Mega Menü - Cafe', '{
    "title": "Cafe & Restoranlar",
    "images": [
        { "src": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&q=80", "alt": "Cafe 1" },
        { "src": "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80", "alt": "Cafe 2" },
        { "src": "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&q=80", "alt": "Waffle" }
    ]
}');

-- 3. Mega Menu - Stores
INSERT INTO site_settings (key, label, value) VALUES
('mega_menu_stores', 'Mega Menü - Mağazalar', '{
    "title": "Mağazalar",
    "images": [
        { "src": "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&q=80", "alt": "Fashion 1" },
        { "src": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80", "alt": "Fashion 2" },
        { "src": "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&q=80", "alt": "Fashion 3" }
    ]
}');

-- 4. Mega Menu - Entertainment (Eğlence)
INSERT INTO site_settings (key, label, value) VALUES
('mega_menu_events', 'Mega Menü - Eğlence', '{
    "title": "Eğlence",
    "images": [
        { "src": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80", "alt": "Cinema" },
        { "src": "https://images.unsplash.com/photo-1566453838764-f6b97f67041b?w=500&q=80", "alt": "Playground" },
        { "src": "https://images.unsplash.com/photo-1596464716127-f9a804ed15f5?w=500&q=80", "alt": "Kids" }
    ]
}');

-- 5. Mega Menu - Activities (Etkinlikler)
INSERT INTO site_settings (key, label, value) VALUES
('mega_menu_activities', 'Mega Menü - Etkinlikler', '{
    "title": "Etkinlikler",
    "images": [
        { "src": "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&q=80", "alt": "Event 1" },
        { "src": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80", "alt": "Event 2" },
        { "src": "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=500&q=80", "alt": "Event 3" }
    ]
}');

-- 6. Mega Menu - Campaigns (Kampanyalar)
INSERT INTO site_settings (key, label, value) VALUES
('mega_menu_campaigns', 'Mega Menü - Kampanyalar', '{
    "title": "Kampanyalar",
    "images": [
        { "src": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&q=80", "alt": "Sale 1" },
        { "src": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80", "alt": "Sale 2" },
        { "src": "https://images.unsplash.com/photo-1472851294608-415105022054?w=500&q=80", "alt": "Sale 3" }
    ]
}');
