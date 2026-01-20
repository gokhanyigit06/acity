'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
    // Navbar
    'nav.home': { tr: 'ANASAYFA', en: 'HOME' },
    'nav.dining': { tr: 'CAFE & RESTORANT', en: 'DINING' },
    'nav.stores': { tr: 'MAĞAZALAR', en: 'STORES' },
    'nav.entertainment': { tr: 'EĞLENCE', en: 'ENTERTAINMENT' },
    'nav.events': { tr: 'ETKİNLİKLER', en: 'EVENTS' },
    'nav.campaigns': { tr: 'KAMPANYALAR', en: 'CAMPAIGNS' },
    'nav.contact': { tr: 'İLETİŞİM', en: 'CONTACT' },
    'nav.search_placeholder': { tr: 'Mağaza veya etkinlik ara...', en: 'Search stores or events...' },
    'nav.get_directions': { tr: 'Yol Tarifi Al', en: 'Get Directions' },
    'nav.search': { tr: 'Arama Yap', en: 'Search' },

    // Footer
    'footer.about': { tr: 'Hakkımızda', en: 'About Us' },
    'footer.contact': { tr: 'İletişim', en: 'Contact' },
    'footer.follow_us': { tr: 'Bizi Takip Edin', en: 'Follow Us' },
    'footer.rights': { tr: 'Tüm hakları saklıdır.', en: 'All rights reserved.' },
    'footer.address_line1': { tr: 'Macun Mah. Fatih Sultan Mehmet Bulvarı', en: 'Macun Dist. Fatih Sultan Mehmet Blvd.' },
    'footer.address_line2': { tr: 'No:244 Yenimahalle', en: 'No:244 Yenimahalle' },
    'footer.address_city': { tr: 'Ankara', en: 'Ankara' },
    'footer.phone': { tr: 'Telefon', en: 'Phone' },
    'footer.email': { tr: 'Email', en: 'Email' },
    'footer.hours': { tr: 'Çalışma Saatleri', en: 'Working Hours' },
    'footer.brands': { tr: 'Markalar', en: 'Brands' },
    'footer.write_us': { tr: 'Bize Yazın', en: 'Write to Us' },

    // Common
    'common.view_all': { tr: 'Tümü', en: 'View All' },
    'common.all': { tr: 'TÜMÜ', en: 'ALL' },
    'common.loading': { tr: 'Yükleniyor...', en: 'Loading...' },
    'common.floor_select': { tr: 'Kata Göre', en: 'By Floor' },
    'common.category_select': { tr: 'Kategoriye Göre', en: 'By Category' },

    // Dining Page
    'dining.title': { tr: 'Cafe & Restorant', en: 'Dining' },
    'dining.search_placeholder': { tr: 'Restorant Ara', en: 'Search Restaurants' },
    'dining.no_results': { tr: 'Aradığınız kriterlere uygun restoran bulunamadı.', en: 'No restaurants found matching your criteria.' },
    'category.dining_all': { tr: 'Tümü (Yeme-İçme)', en: 'All (Dining)' },

    // Stores Page
    'stores.title': { tr: 'Mağazalar', en: 'Stores' },
    'stores.search_placeholder': { tr: 'Mağaza Ara', en: 'Search Stores' },
    'stores.no_results': { tr: 'Aradığınız kriterlere uygun mağaza bulunamadı.', en: 'No stores found matching your criteria.' },
    'category.stores_all': { tr: 'Tümü (Mağazalar)', en: 'All (Stores)' },

    // Events (Entertainment) Page
    'events.title': { tr: 'Eğlence & Etkinlik', en: 'Entertainment & Events' },
    'events.search_placeholder': { tr: 'Eğlence Ara', en: 'Search Entertainment' },
    'events.no_results': { tr: 'Aradığınız kriterlere uygun eğlence noktası bulunamadı.', en: 'No entertainment items found matching your criteria.' },
    'category.entertainment_all': { tr: 'Tümü (Eğlence)', en: 'All (Entertainment)' },

    // Home - Story Section
    'home.story_title': { tr: 'ALIŞVERİŞİN\nPARLAYAN YILDIZI', en: 'THE SHINING STAR\nOF SHOPPING' },
    'home.story_description': { tr: "Acity Mall, Ankara'nın alışveriş ve yaşam kültüründe değişimi izleyen ve yeniliği belirleyen bir konumda yer alıyor. Kuruluş yıllarındaki outlet kimliğinden üst segment bir alışveriş merkezine dönüşerek, seçkin markaları ve özgün deneyimleri bir araya getiriyor.", en: "Acity Mall stands at a position that monitors change and determines innovation in Ankara's shopping and life culture. Transforming from its outlet identity in its founding years to an upper-segment shopping center, it brings together exclusive brands and unique experiences." },
    'home.story_alt': { tr: 'Alışverişin Parlayan Yıldızı', en: 'The Shining Star of Shopping' },

    // Floors
    'floor.minus_2': { tr: 'Kat -2', en: 'Floor -2' },
    'floor.minus_1': { tr: 'Kat -1', en: 'Floor -1' },
    'floor.ground': { tr: 'Zemin Kat', en: 'Ground Floor' },
    'floor.1': { tr: 'Kat 1', en: 'Floor 1' },
    'floor.2': { tr: 'Kat 2', en: 'Floor 2' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('tr');

    // Load language from local storage on mount
    useEffect(() => {
        const savedLang = localStorage.getItem('site_language') as Language;
        if (savedLang && (savedLang === 'tr' || savedLang === 'en')) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setLanguage(savedLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('site_language', lang);
    };

    const t = (key: string) => {
        return translations[key]?.[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
