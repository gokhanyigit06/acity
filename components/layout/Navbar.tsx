
"use client";

import Link from 'next/link';
import { Search, MapPin, X, Menu } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export function Navbar() {
    const { language, setLanguage } = useLanguage();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const toggleLanguage = () => {
        setLanguage(language === 'tr' ? 'en' : 'tr');
    };

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
                        >
                            ANASAYFA
                        </Link>

                        <Link
                            href="/hakkimizda"
                            className="hover:opacity-70 transition-opacity"
                        >
                            KURUMSAL
                        </Link>

                        <Link
                            href="/magazalar"
                            className="hover:opacity-70 transition-opacity"
                        >
                            MAĞAZALAR
                        </Link>

                        <Link
                            href="/eglence"
                            className="hover:opacity-70 transition-opacity"
                        >
                            ETKİNLİKLER / KAMP.
                        </Link>

                        <Link
                            href="/hizmetler"
                            className="hover:opacity-70 transition-opacity"
                        >
                            HİZMETLER
                        </Link>

                        <Link
                            href="/iletisim"
                            className="hover:opacity-70 transition-opacity"
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
                                <button
                                    onClick={toggleLanguage} // Assuming toggleLanguage and 'language' state are defined elsewhere
                                    className="hover:opacity-70 transition-opacity text-sm font-bold px-3 py-1 rounded-md border border-neutral-200 hover:border-neutral-800"
                                >
                                    {language === 'en' ? 'TR' : 'EN'}
                                </button>
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
                            <span className="text-2xl font-bold tracking-widest uppercase text-black">Acity Mall</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <nav className="flex flex-col space-y-6 text-xl font-semibold text-neutral-800">
                                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>ANASAYFA</Link>
                                <Link href="/hakkimizda" onClick={() => setIsMobileMenuOpen(false)}>KURUMSAL</Link>
                                <Link href="/magazalar" onClick={() => setIsMobileMenuOpen(false)}>MAĞAZALAR</Link>
                                <Link href="/eglence" onClick={() => setIsMobileMenuOpen(false)}>ETKİNLİKLER / KAMP.</Link>
                                <Link href="/hizmetler" onClick={() => setIsMobileMenuOpen(false)}>HİZMETLER</Link>
                                <Link href="/iletisim" onClick={() => setIsMobileMenuOpen(false)}>İLETİŞİM</Link>
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


            </div>
        </header>
    );
}
