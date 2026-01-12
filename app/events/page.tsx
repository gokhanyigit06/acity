'use client';

import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// Types
interface EntertainmentSpot {
    id: number;
    name: string;
    category: string;
    floor: string;
    phone: string;
    image: string; // Changed logic from 'logo' to generic 'image' or just keep logic similar
}

// Mock Data
const MOCK_ENTERTAINMENT: EntertainmentSpot[] = [
    { id: 1, name: "Acity Cinevizyon", category: "Sinema", floor: "2. Kat", phone: "0(312) 387 38 38", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80" },
    { id: 2, name: "Eğlence Adası", category: "Oyun & Eğlence", floor: "2. Kat", phone: "0(312) 541 20 20", image: "https://images.unsplash.com/photo-1566453838764-f6b97f67041b?w=500&q=80" },
    { id: 3, name: "Kumpanya Kum Havuzu", category: "Çocuk", floor: "1. Kat", phone: "0(312) 541 10 10", image: "https://images.unsplash.com/photo-1596464716127-f9a804ed15f5?w=500&q=80" },
    { id: 4, name: "Bowling", category: "Oyun & Eğlence", floor: "2. Kat", phone: "0(312) 541 30 30", image: "https://images.unsplash.com/photo-1533561362705-758fa492572e?w=500&q=80" },
    { id: 5, name: "Çocuk Treni", category: "Çocuk", floor: "Zemin Kat", phone: "0(312) 541 40 40", image: "https://images.unsplash.com/photo-1516733968668-dbdce39c4651?w=500&q=80" },
];

const ALPHABET = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");

export default function EntertainmentPage() {
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFloor, setSelectedFloor] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    // Filtering Logic
    const filteredItems = MOCK_ENTERTAINMENT.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLetter = selectedLetter ? item.name.startsWith(selectedLetter) : true;
        const matchesFloor = selectedFloor ? item.floor === selectedFloor : true;
        const matchesCategory = selectedCategory ? item.category === selectedCategory : true;

        return matchesSearch && matchesLetter && matchesFloor && matchesCategory;
    });

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Header / Filter Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-8">Eğlence & Etkinlik</h1>

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
                                <option value="Sinema">Sinema</option>
                                <option value="Oyun & Eğlence">Oyun & Eğlence</option>
                                <option value="Çocuk">Çocuk</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500 pointer-events-none" />
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-1/2 ml-auto">
                            <input
                                type="text"
                                placeholder="Eğlence Ara"
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="bg-white border border-slate-200 p-6 flex items-center gap-6 group hover:shadow-lg transition-all duration-300">

                            {/* Image/Logo Area */}
                            <div className="w-1/3 shrink-0">
                                <div className="relative w-full aspect-[3/2] flex items-center justify-center rounded overflow-hidden bg-gray-100">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Fallback for now if image errors, but using unsplash should be fine */}
                                </div>
                            </div>

                            {/* Divider line */}
                            <div className="w-px h-20 bg-slate-100" />

                            {/* Details Area */}
                            <div className="w-2/3 space-y-2">
                                <h3 className="font-bold text-slate-900 leading-tight">{item.name}</h3>
                                <p className="text-sm text-slate-500">{item.category}</p>
                                <p className="text-sm text-slate-900 font-medium">{item.phone}</p>
                                <p className="text-xs text-slate-400">{item.floor}</p>
                            </div>

                        </div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-20 text-slate-400">
                        Aradığınız kriterlere uygun eğlence noktası bulunamadı.
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
