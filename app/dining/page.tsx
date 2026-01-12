'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';

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

export default function DiningPage() {
    const [stores, setStores] = useState<Dining[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFloor, setSelectedFloor] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    // Fetch Data from Supabase
    useEffect(() => {
        const fetchDining = async () => {
            try {
                // Fetch all stores that are categorized as dining (Yeme-İçme)
                // Since we imported them as 'Yeme-İçme', we filter by that.
                const { data, error } = await supabase
                    .from('stores')
                    .select('*')
                    .eq('category', 'Yeme-İçme'); // Filter specific to dining page

                if (error) throw error;

                if (data) {
                    setStores(data);
                }
            } catch (error) {
                console.error('Error fetching dining spots:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDining();
    }, []);

    // Filtering Logic
    const filteredDining = stores.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLetter = selectedLetter ? item.name.startsWith(selectedLetter) : true;
        const matchesFloor = selectedFloor ? item.floor === selectedFloor : true;
        // Since all current data is 'Yeme-İçme', fine-grained filtering won't work yet unless we update data.
        // Keeping logic generic for now.
        const matchesCategory = selectedCategory ? item.category === selectedCategory : true;

        return matchesSearch && matchesLetter && matchesFloor && matchesCategory;
    });

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-8">Cafe & Restorant</h1>

                    {/* Top Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        {/* Floor Select */}
                        <div className="relative w-full md:w-1/4">
                            <select
                                className="w-full h-12 pl-4 pr-10 bg-slate-50 border-none text-slate-700 font-medium rounded-none appearance-none focus:outline-none focus:ring-2 focus:ring-red-100"
                                value={selectedFloor}
                                onChange={(e) => setSelectedFloor(e.target.value)}
                            >
                                <option value="">Kata Göre</option>
                                <option value="-1. Kat">-1. Kat</option>
                                <option value="Zemin Kat">Zemin Kat</option>
                                <option value="1. Kat">1. Kat</option>
                                <option value="2. Kat">2. Kat</option>
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
                                <option value="">Kategoriye Göre</option>
                                {/* Updated options based on current data, can add more as data enriches */}
                                <option value="Yeme-İçme">Tümü (Yeme-İçme)</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500 pointer-events-none" />
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-1/2 ml-auto">
                            <input
                                type="text"
                                placeholder="Restoran Ara"
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
                            TÜMÜ
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
                    <div className="text-center py-20 text-slate-400">Yükleniyor...</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDining.map((item) => (
                                <div key={item.id} className="bg-white border border-slate-200 p-6 flex items-center gap-6 group hover:shadow-lg transition-all duration-300">

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
                                        <h3 className="font-bold text-slate-900 leading-tight">{item.name}</h3>
                                        <p className="text-sm text-slate-500">{item.category}</p>
                                        <p className="text-sm text-slate-900 font-medium">{item.phone || "-"}</p>
                                        <p className="text-xs text-slate-400">{item.floor}</p>
                                    </div>

                                </div>
                            ))}
                        </div>

                        {filteredDining.length === 0 && (
                            <div className="text-center py-20 text-slate-400">
                                Aradığınız kriterlere uygun restoran bulunamadı.
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </main>
    );
}
