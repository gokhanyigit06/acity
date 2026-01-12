'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Types
interface Store {
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

export default function EntertainmentPage() {
    const { t } = useLanguage();
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFloor, setSelectedFloor] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    // Fetch Data from Supabase
    useEffect(() => {
        let mounted = true;

        const fetchEntertainment = async () => {
            try {
                // Fetch all stores categorized as 'Eğlence'
                const { data, error } = await supabase
                    .from('stores')
                    .select('*')
                    .eq('category', 'Eğlence');

                if (error) {
                    throw error;
                }

                if (mounted && data) {
                    setStores(data);
                }
            } catch (error) {
                console.error('Error fetching entertainment:', error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchEntertainment();

        return () => {
            mounted = false;
        };
    }, []);

    // Filtering Logic
    const filteredItems = stores.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLetter = selectedLetter ? item.name.startsWith(selectedLetter) : true;
        const matchesFloor = selectedFloor ? item.floor === selectedFloor : true;

        // Currently data is single category 'Eğlence', but filter ready for expansion
        const matchesCategory = selectedCategory ? item.category === selectedCategory : true;

        return matchesSearch && matchesLetter && matchesFloor && matchesCategory;
    });

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Header / Filter Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-8">{t('events.title')}</h1>

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
                                <option value="Kat 1">{t('floor.1')}</option>
                                <option value="Kat 2">{t('floor.2')}</option>
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
                                <option value="Eğlence">{t('category.entertainment_all')}</option>
                                {/* Future sub-categories like Cinema, Kids Zone etc can be added here once data is enriched */}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500 pointer-events-none" />
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-1/2 ml-auto">
                            <input
                                type="text"
                                placeholder={t('events.search_placeholder')}
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
                            {filteredItems.map((item) => (
                                <Link
                                    href={`/magazalar/${item.slug}`}
                                    key={item.id}
                                    className="bg-white border border-slate-200 p-6 flex items-center gap-6 group hover:shadow-lg transition-all duration-300 block"
                                >

                                    {/* Image/Logo Area */}
                                    <div className="w-1/3 shrink-0">
                                        <div className="relative w-full aspect-[3/2] flex items-center justify-center rounded overflow-hidden bg-gray-50">
                                            {item.logo_url ? (
                                                <img src={item.logo_url} alt={item.name} className="object-cover w-full h-full" />
                                            ) : (
                                                <div className="text-xl font-bold text-slate-900 leading-tight text-center break-words p-2">
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

                        {filteredItems.length === 0 && (
                            <div className="text-center py-20 text-slate-400">
                                {t('events.no_results')}
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </main>
    );
}
