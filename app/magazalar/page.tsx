'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Types
// Types
interface Store {
    id: number;
    name: string;
    category: string;
    floor: string;
    phone: string;
    logo_url: string;
    slug: string;
    store_categories?: {
        categories: {
            name: string;
        } | null;
    }[];
}

interface Category {
    id: number;
    name: string;
}

const ALPHABET = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");

import { useLanguage } from '@/context/LanguageContext';

export default function StoresPage() {
    const { t } = useLanguage();
    const [stores, setStores] = useState<Store[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFloor, setSelectedFloor] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    // Fetch Data from Supabase
    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            try {
                // Fetch categories
                const { data: categoriesData } = await supabase
                    .from('categories')
                    .select('*')
                    .order('name');

                if (mounted && categoriesData) {
                    const excludedCategories = [
                        'Cafe Restoranlar', 'Cafe & Restorant',
                        'Mobilya',
                        'Eğlence',
                        'hizmet', 'Hizmet',
                        'Mağazalar',
                        'giyim moda', 'Giyim & Moda',
                        'Ev & Mobilya'
                    ];

                    // Map categories: Rename Standlar to Kiosk
                    const mappedCategories = categoriesData
                        .map(cat => ({
                            ...cat,
                            name: cat.name === 'Standlar' ? 'Kiosk' : cat.name
                        }))
                        .filter(cat => !excludedCategories.includes(cat.name));

                    // Remove duplicates if Kiosk already existed and we just renamed Standlar to it
                    const uniqueCategories = Array.from(new Map(mappedCategories.map(item => [item.name, item])).values());

                    setCategories(uniqueCategories);
                }

                // Fetch stores (excluding Dining and Entertainment)
                const { data: storesData, error } = await supabase
                    .from('stores')
                    .select(`
                        *,
                        store_categories (
                            categories (
                                name
                            )
                        )
                    `)
                    .neq('category', 'Cafe & Restorant')
                    .neq('category', 'Eğlence')
                    .order('name', { ascending: true });

                if (error) {
                    throw error;
                }

                if (mounted && storesData) {
                    // Normalize store data to treat Standlar as Kiosk
                    const mappedStores = storesData.map(store => ({
                        ...store,
                        category: store.category === 'Standlar' ? 'Kiosk' : store.category,
                        store_categories: store.store_categories?.map((sc: any) => ({
                            ...sc,
                            categories: sc.categories ? {
                                ...sc.categories,
                                name: sc.categories.name === 'Standlar' ? 'Kiosk' : sc.categories.name
                            } : null
                        }))
                    }));
                    setStores(mappedStores);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            mounted = false;
        };
    }, []);

    // Filtering Logic
    const filteredStores = stores.filter(store => {
        const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLetter = selectedLetter ? store.name.startsWith(selectedLetter) : true;
        const matchesFloor = selectedFloor ? store.floor === selectedFloor : true;

        const matchesCategory = selectedCategory
            ? (store.category === selectedCategory || store.store_categories?.some((sc: any) => sc.categories?.name === selectedCategory))
            : true;

        return matchesSearch && matchesLetter && matchesFloor && matchesCategory;
    });

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Header / Filter Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-8">{t('stores.title')}</h1>

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
                                <option value="Kat -2">{t('floor.minus_2')}</option>
                                <option value="Kat -1">{t('floor.minus_1')}</option>
                                <option value="Zemin Kat">{t('floor.ground')}</option>
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
                                <option value="">{t('category.stores_all')}</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500 pointer-events-none" />
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-1/2 ml-auto">
                            <input
                                type="text"
                                placeholder={t('stores.search_placeholder')}
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
                            {filteredStores.map((store) => (
                                <Link
                                    href={`/magazalar/${store.slug}`}
                                    key={store.id}
                                    className="bg-white border border-slate-200 p-6 flex items-center gap-6 group hover:shadow-lg transition-all duration-300 block"
                                >

                                    {/* Logo Area */}
                                    <div className="w-1/3 shrink-0">
                                        <div className="relative w-full aspect-[3/2] flex items-center justify-center">
                                            {/* Fallback to text if no logo */}
                                            {store.logo_url ? (
                                                <img src={store.logo_url} alt={store.name} className="object-contain w-full h-full" />
                                            ) : (
                                                <div className="text-xl font-bold text-slate-900 leading-tight text-center break-words">
                                                    {store.name.split(' ')[0]}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Divider line */}
                                    <div className="w-px h-20 bg-slate-100" />

                                    {/* Details Area */}
                                    <div className="w-2/3 space-y-2">
                                        <h3 className="font-bold text-slate-900 leading-tight group-hover:text-red-600 transition-colors">{store.name}</h3>
                                        <p className="text-sm text-slate-500">
                                            {[
                                                store.category,
                                                ...(store.store_categories?.map((sc: any) => sc.categories?.name) || [])
                                            ].filter((v, i, a) => v && a.indexOf(v) === i).join(', ')}
                                        </p>
                                        <p className="text-sm text-slate-900 font-medium">{store.phone || "-"}</p>
                                        <p className="text-xs text-slate-400">{store.floor}</p>
                                    </div>

                                </Link>
                            ))}
                        </div>

                        {filteredStores.length === 0 && (
                            <div className="text-center py-20 text-slate-400">
                                {t('stores.no_results')}
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </main>
    );
}
