-- Add Settings for Home Page Sections

-- 7. Info Section
INSERT INTO site_settings (key, label, value) VALUES
('info_section', 'Bilgi Alanı (Info Section)', '{
    "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    "smallTitle": "Yeniliğin Işığı",
    "bigTitle": "Senin Yıldızın\nParlak!",
    "description": "Acity için yıldız yalnızca bir sembol değil; aynı zamanda iyiliğe yön veren bir pusula. Acity''nin enerji verimliliğini ve çevreyi önceleyen uygulamaları da bu pusulanın bir parçası."
}');

-- 8. Image Banner
INSERT INTO site_settings (key, label, value) VALUES
('image_banner', 'Resim Banner', '{
    "imageUrl": "https://images.unsplash.com/photo-1517604931442-71053e6e2460?w=1600&q=80",
    "title": "HER ADIMDA BİRAZ DAHA PARLA!"
}');

-- 9. Double Image Link
INSERT INTO site_settings (key, label, value) VALUES
('double_image_link', 'ikili Görsel Link', '[
    {
        "title": "Lezzetin Adresi: Cafe & Restoran",
        "image": "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
        "href": "/dining"
    },
    {
        "title": "Modanın Kalbi: Giyim & Aksesuar",
        "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
        "href": "/stores"
    }
]');

-- 10. Story Section
INSERT INTO site_settings (key, label, value) VALUES
('story_section', 'Hikaye Alanı', '{
    "image": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    "title": "ALIŞVERİŞİN\nPARLAYAN YILDIZI",
    "description": "Acity Mall, Ankara''nın alışveriş ve yaşam kültüründe değişimi izleyen ve yeniliği belirleyen bir konumda yer alıyor. Kuruluş yıllarındaki outlet kimliğinden üst segment bir alışveriş merkezine dönüşerek, seçkin markaları ve özgün deneyimleri bir araya getiriyor."
}');
