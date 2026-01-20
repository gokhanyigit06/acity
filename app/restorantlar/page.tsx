'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Types
interface Dining {
    id: number;
    name: string;
    category: string;
    floor: string;
    phone: string;
    logo_url: string;
    slug: string;
}

const ALPHABET = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");

import { useLanguage } from '@/context/LanguageContext';

// ... (keep usage)

export default function DiningPage() {
    const { t } = useLanguage();
    const [stores, setStores] = useState<Dining[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFloor, setSelectedFloor] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    // Fetch Data from Supabase
    useEffect(() => {
        let mounted = true;

        const fetchDining = async () => {
            try {
                // Fetch all stores categorized as 'Cafe & Restorant'
                const { data, error } = await supabase
                    .from('stores')
                    .select('*')
                    .eq('category', 'Cafe & Restorant');

                if (error) {
                    throw error;
                }

                if (mounted && data) {
                    setStores(data);
                }
            } catch (error) {
                console.error('Error fetching dining establishments:', error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchDining();

        return () => {
            mounted = false;
        };
    }, []);

    // Filtering Logic
    const filteredDining = stores.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLetter = selectedLetter ? item.name.startsWith(selectedLetter) : true;
        const matchesFloor = selectedFloor ? item.floor === selectedFloor : true;

        // Match category exactly if selected, otherwise allow all
        const matchesCategory = selectedCategory ? item.category === selectedCategory : true;

        return matchesSearch && matchesLetter && matchesFloor && matchesCategory;
    });

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-8">{t('dining.title')}</h1>

                    {/* Top Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        {/* Floor Select */}
                        <div className="relative w-full md:w-1/4">
                            <select
                                className="w-full h-12 pl-4 pr-10 bg-slate-50 border-none text-slate-700 font-medium rounded-none appearance-none focus:outline-none focus:ring-2 focus:ring-red-100"
                                value={selectedFloor}
                                onChange={(e) => setSelectedFloor(e.target.value)}
                            >
                                <option value="">{t('common.floor_select')}</option>
                                <option value="-2. Kat">{t('floor.minus_2')}</option>
                                <option value="-1. Kat">{t('floor.minus_1')}</option>
                                <option value="Zemin Kat">{t('floor.ground')}</option>
                                <option value="1. Kat">{t('floor.1')}</option>
                                <option value="2. Kat">{t('floor.2')}</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500 pointer-events-none" />
                        </div>

                        {/* Category Select */}
                        <div className="relative w-full md:w-1/4">
                            <select
                                className="w-full h-12 pl-4 pr-10 bg-slate-50 border-none text-slate-700 font-medium rounded-none appearance-none focus:outline-none focus:ring-2 focus:ring-red-100"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">{t('common.category_select')}</option>
                                {/* Updated options based on current data, can add more as data enriches */}
                                <option value="Cafe & Restorant">{t('category.dining_all')}</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500 pointer-events-none" />
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-1/2 ml-auto">
                            <input
                                type="text"
                                placeholder={t('dining.search_placeholder')}
                                className="w-full h-12 pl-4 pr-12 bg-slate-50 border-none text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-100"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-red-500" />
                        </div>
                    </div>

                    {/* Alphabet Filter */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-6">
                        <button
                            onClick={() => setSelectedLetter(null)}
                            className={`text-sm font-medium transition-colors ${selectedLetter === null ? 'text-red-600' : 'text-slate-300 hover:text-slate-500'}`}
                        >
                            {t('common.all')}
                        </button>
                        {ALPHABET.map((char) => (
                            <button
                                key={char}
                                onClick={() => setSelectedLetter(char)}
                                className={`text-sm font-medium transition-colors ${selectedLetter === char ? 'text-red-600' : 'text-slate-300 hover:text-slate-500'}`}
                            >
                                {char}
                            </button>
                        ))}
                    </div>

                </div>
            </div>

            {/* Results Grid */}
            <div className="container mx-auto px-4 py-12">
                {loading ? (
                    <div className="text-center py-20 text-slate-400">{t('common.loading')}</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDining.map((item) => (
                                <Link
                                    href={`/magazalar/${item.slug}`}
                                    key={item.id}
                                    className="bg-white border border-slate-200 p-6 flex items-center gap-6 group hover:shadow-lg transition-all duration-300 block"
                                >

                                    {/* Logo Area */}
                                    <div className="w-1/3 shrink-0">
                                        <div className="relative w-full aspect-[3/2] flex items-center justify-center">
                                            {/* Fallback to text if no logo */}
                                            {item.logo_url ? (
                                                <img src={item.logo_url} alt={item.name} className="object-contain w-full h-full" />
                                            ) : (
                                                <div className="text-xl font-bold text-slate-900 leading-tight text-center break-words">
                                                    {item.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Divider line */}
                                    <div className="w-px h-20 bg-slate-100" />

                                    {/* Details Area */}
                                    <div className="w-2/3 space-y-2">
                                        <h3 className="font-bold text-slate-900 leading-tight group-hover:text-red-600 transition-colors">{item.name}</h3>
                                        <p className="text-sm text-slate-500">{item.category}</p>
                                        <p className="text-sm text-slate-900 font-medium">{item.phone || "-"}</p>
                                        <p className="text-xs text-slate-400">{item.floor}</p>
                                    </div>

                                </Link>
                            ))}
                        </div>

                        {filteredDining.length === 0 && (
                            <div className="text-center py-20 text-slate-400">
                                {t('dining.no_results')}
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </main>
    );
}
