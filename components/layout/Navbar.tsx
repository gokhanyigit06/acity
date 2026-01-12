
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, ChevronDown, ArrowRight, X, Menu } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface MegaMenuItem {
    title: string;
    items: { label: string; href: string }[];
    cta: { label: string; href: string };
    images: { src: string; alt: string }[];
}

const MEGA_MENUS: Record<string, MegaMenuItem> = {
    "cafe": {
        title: "Cafe & Restorant",
        items: [
            { label: "Burger King", href: "/cafe/burger-king" },
            { label: "Terra Pizza", href: "/cafe/terra-pizza" },
            { label: "Meywa Waffle", href: "/cafe/meywa-waffle" },
        ],
        cta: { label: "Tüm Restoranlar", href: "/dining" },
        images: [
            { src: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80", alt: "Burger" },
            { src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80", alt: "Pizza" },
            { src: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&q=80", alt: "Waffle" },
        ]
    },
    "stores": {
        title: "Mağazalar",
        items: [
            { label: "LC WAIKIKI", href: "/stores/lc-waikiki" },
            { label: "GUESS", href: "/stores/guess" },
            { label: "TOMMY HILFIGER", href: "/stores/tommy-hilfiger" },
        ],
        cta: { label: "Tüm Mağazalar", href: "/stores" },
        images: [
            { src: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&q=80", alt: "Fashion 1" },
            { src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80", alt: "Fashion 2" },
            { src: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&q=80", alt: "Fashion 3" },
        ]
    },
    "events": {
        title: "Eğlence",
        items: [
            { label: "ACity Cinevizyon", href: "/cinema" },
            { label: "Eğlence Adası", href: "/entertainment" },
            { label: "Kumpanya Kum Havuzu", href: "/kids" },
        ],
        cta: { label: "Tüm Eğlence", href: "/events" },
        images: [
            { src: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80", alt: "Cinema" },
            { src: "https://images.unsplash.com/photo-1566453838764-f6b97f67041b?w=500&q=80", alt: "Playground" },
            { src: "https://images.unsplash.com/photo-1596464716127-f9a804ed15f5?w=500&q=80", alt: "Kids" },
        ]
    },
    "activities": {
        title: "Etkinlikler",
        items: [
            { label: "Etkinlik Takvimi", href: "/activities/calendar" },
            { label: "Çocuk Atölyeleri", href: "/activities/kids-workshops" },
            { label: "Konserler", href: "/activities/concerts" },
        ],
        cta: { label: "Tüm Etkinlikler", href: "/activities" },
        images: [
            { src: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&q=80", alt: "Event 1" },
            { src: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=500&q=80", alt: "Event 2" },
            { src: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=500&q=80", alt: "Event 3" },
        ]
    },
    "campaigns": {
        title: "Kampanyalar",
        items: [
            { label: "Güncel Kampanyalar", href: "/campaigns/current" },
            { label: "Sezon İndirimleri", href: "/campaigns/seasonal" },
            { label: "Mağaza Fırsatları", href: "/campaigns/stores" },
        ],
        cta: { label: "Tüm Kampanyalar", href: "/campaigns" },
        images: [
            { src: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&q=80", alt: "Sale 1" },
            { src: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=500&q=80", alt: "Sale 2" },
            { src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80", alt: "Sale 3" },
        ]
    }
};

interface NavbarProps {
    megaMenuSettings?: Record<string, any>;
}

export function Navbar({ megaMenuSettings }: NavbarProps) {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    // Merge default menus with dynamic settings
    const displayMenus = { ...MEGA_MENUS };
    if (megaMenuSettings) {
        Object.keys(displayMenus).forEach(menuKey => {
            const settingKey = `mega_menu_${menuKey}`;
            if (megaMenuSettings[settingKey]) {
                // Override images if present in settings
                const dynamicData = megaMenuSettings[settingKey];
                if (dynamicData.images && Array.isArray(dynamicData.images)) {
                    displayMenus[menuKey] = {
                        ...displayMenus[menuKey],
                        images: dynamicData.images
                    };
                }
            }
        });
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log("Searching for:", searchQuery);
            // Implement navigation to search page eventually
            // router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    return (
        <header
            className="sticky top-0 w-full bg-white pt-6 pb-6 relative z-50 border-b border-transparent hover:border-gray-100 transition-all shadow-sm"
            onMouseLeave={() => setActiveMenu(null)}
        >
            <div className="container mx-auto px-4 flex flex-col items-center gap-6 md:gap-10">
                {/* Logo and Mobile Toggle */}
                <div className="w-full relative flex items-center justify-center md:justify-center">
                    {/* Mobile Menu Button - Left Aligned */}
                    <button
                        className="absolute left-0 top-1/2 -translate-y-1/2 md:hidden p-2 hover:bg-gray-100 rounded-full"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="w-6 h-6 text-black" />
                    </button>

                    <div className="text-center relative z-20">
                        <Link href="/" className="text-3xl md:text-4xl tracking-[0.2em] font-medium text-black uppercase">
                            ACITY MALL
                        </Link>
                    </div>
                </div>

                {/* Navigation Bar (Desktop) */}
                <div className="w-full flex items-center justify-between relative px-4">
                    <div className="hidden md:block flex-1"></div>

                    <nav className={cn(
                        "hidden md:flex items-center gap-7 text-base font-semibold tracking-wide text-neutral-800 transition-opacity duration-300",
                        isSearchOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                    )}>
                        <Link
                            href="/"
                            className="px-6 py-2.5 rounded-full border border-neutral-300 hover:border-black transition-colors"
                            onMouseEnter={() => setActiveMenu(null)}
                        >
                            ANASAYFA
                        </Link>

                        {/* Cafe Menu */}
                        <div
                            className="flex items-center gap-1.5 cursor-pointer h-10 group"
                            onMouseEnter={() => setActiveMenu('cafe')}
                        >
                            <span className={cn("transition-opacity", activeMenu === 'cafe' ? "text-red-600" : "group-hover:opacity-70")}>CAFE & RESTORANT</span>
                            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", activeMenu === 'cafe' && "rotate-180")} />
                        </div>

                        {/* Stores Menu */}
                        <div
                            className="flex items-center gap-1.5 cursor-pointer h-10 group"
                            onMouseEnter={() => setActiveMenu('stores')}
                        >
                            <span className={cn("transition-opacity", activeMenu === 'stores' ? "text-red-600" : "group-hover:opacity-70")}>MAĞAZALAR</span>
                            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", activeMenu === 'stores' && "rotate-180")} />
                        </div>

                        {/* Events Menu */}
                        <div
                            className="flex items-center gap-1.5 cursor-pointer h-10 group"
                            onMouseEnter={() => setActiveMenu('events')}
                        >
                            <span className={cn("transition-opacity", activeMenu === 'events' ? "text-red-600" : "group-hover:opacity-70")}>EĞLENCE</span>
                            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", activeMenu === 'events' && "rotate-180")} />
                        </div>

                        {/* Activities Menu */}
                        <div
                            className="flex items-center gap-1.5 cursor-pointer h-10 group"
                            onMouseEnter={() => setActiveMenu('activities')}
                        >
                            <span className={cn("transition-opacity", activeMenu === 'activities' ? "text-red-600" : "group-hover:opacity-70")}>ETKİNLİKLER</span>
                            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", activeMenu === 'activities' && "rotate-180")} />
                        </div>

                        {/* Campaigns Menu */}
                        <div
                            className="flex items-center gap-1.5 cursor-pointer h-10 group"
                            onMouseEnter={() => setActiveMenu('campaigns')}
                        >
                            <span className={cn("transition-opacity", activeMenu === 'campaigns' ? "text-red-600" : "group-hover:opacity-70")}>KAMPANYALAR</span>
                            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", activeMenu === 'campaigns' && "rotate-180")} />
                        </div>

                        <Link
                            href="/contact"
                            className="hover:opacity-70 transition-opacity"
                            onMouseEnter={() => setActiveMenu(null)}
                        >
                            İLETİŞİM
                        </Link>
                    </nav>

                    <div className="hidden md:flex items-center gap-6 text-neutral-800 flex-1 justify-end pr-12 relative z-20">
                        {isSearchOpen ? (
                            <button onClick={() => setIsSearchOpen(false)} className="hover:opacity-70 transition-opacity">
                                <X className="w-5 h-5" />
                            </button>
                        ) : (
                            <>
                                <Link
                                    href="https://www.google.com/maps/dir//Acity+Alışveriş+Merkezi,+Macun,+Fatih+Sultan+Mehmet+Blv+No:244,+06374+Yenimahalle%2FAnkara"
                                    target="_blank"
                                    className="hover:opacity-70 transition-opacity"
                                >
                                    <MapPin className="w-5 h-5" />
                                </Link>
                                <button onClick={() => setIsSearchOpen(true)} className="hover:opacity-70 transition-opacity">
                                    <Search className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Search Bar Overlay */}
                <div className={cn(
                    "absolute top-[88px] left-0 w-full flex justify-center items-center transition-all duration-300 z-10",
                    isSearchOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-4"
                )}>
                    <form onSubmit={handleSearch} className="w-full max-w-2xl px-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Mağaza veya etkinlik ara..."
                                className="w-full border-b-2 border-slate-900 py-3 pl-2 pr-12 text-2xl font-light outline-none bg-transparent placeholder:text-gray-300"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus={isSearchOpen}
                            />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 hover:opacity-70">
                                <Search className="w-6 h-6" />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={cn(
                    "fixed inset-0 bg-white z-[60] transition-transform duration-300 ease-in-out md:hidden",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    <div className="flex flex-col h-full p-6">
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-2xl font-bold tracking-widest uppercase">Acity Mall</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <nav className="flex flex-col space-y-6 text-xl font-semibold text-neutral-800">
                                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>ANASAYFA</Link>
                                <Link href="/dining" onClick={() => setIsMobileMenuOpen(false)}>CAFE & RESTORANT</Link>
                                <Link href="/stores" onClick={() => setIsMobileMenuOpen(false)}>MAĞAZALAR</Link>
                                <Link href="/events" onClick={() => setIsMobileMenuOpen(false)}>EĞLENCE</Link>
                                <Link href="/activities" onClick={() => setIsMobileMenuOpen(false)}>ETKİNLİKLER</Link>
                                <Link href="/campaigns" onClick={() => setIsMobileMenuOpen(false)}>KAMPANYALAR</Link>
                                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>İLETİŞİM</Link>
                            </nav>

                            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-4">
                                <Link
                                    href="https://www.google.com/maps/dir//Acity+Alışveriş+Merkezi,+Macun,+Fatih+Sultan+Mehmet+Blv+No:244,+06374+Yenimahalle%2FAnkara"
                                    target="_blank"
                                    className="flex items-center gap-3 text-lg font-medium text-neutral-600"
                                >
                                    <MapPin className="w-6 h-6" />
                                    Yol Tarifi Al
                                </Link>
                                <button onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }} className="flex items-center gap-3 text-lg font-medium text-neutral-600">
                                    <Search className="w-6 h-6" />
                                    Arama Yap
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mega Menu Overlay (Desktop) */}
                {!isSearchOpen && (
                    <div
                        className={cn(
                            "absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 transition-all duration-300 overflow-hidden hidden md:block",
                            activeMenu ? "opacity-100 visible h-[500px]" : "opacity-0 invisible h-0"
                        )}
                        onMouseEnter={() => { }}
                    >
                        {activeMenu && displayMenus[activeMenu] && (
                            <div className="container mx-auto px-4 py-12 flex h-full">
                                {/* Left Column: Links */}
                                <div className="w-1/4 flex flex-col justify-between pr-8">
                                    <div>
                                        <h3 className="text-2xl font-bold text-neutral-800 mb-8">
                                            {displayMenus[activeMenu].title}
                                        </h3>
                                        <ul className="space-y-4">
                                            {displayMenus[activeMenu].items.map((item, idx) => (
                                                <li key={idx}>
                                                    <Link
                                                        href={item.href}
                                                        className="text-neutral-500 font-medium hover:text-black transition-colors"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Link
                                        href={displayMenus[activeMenu].cta.href}
                                        className="text-red-600 font-bold text-lg flex items-center gap-2 hover:gap-3 transition-all"
                                    >
                                        {displayMenus[activeMenu].cta.label}
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>

                                {/* Right Column: Images */}
                                <div className="w-3/4 grid grid-cols-3 gap-6">
                                    {displayMenus[activeMenu].images.map((img, idx) => (
                                        <div key={idx} className="relative h-full rounded-2xl overflow-hidden group">
                                            <Image
                                                src={img.src}
                                                alt={img.alt}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            {/* Overlay effect tailored to match screenshot somewhat (subtle darken) */}
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
