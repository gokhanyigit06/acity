'use client';

import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MapPin, Phone, Clock, Instagram, Globe } from 'lucide-react';

export default function StoreDetailPage({ params }: { params: { slug: string } }) {
    // In a real app, fetch data based on slug. For now, static mock.
    const brand = {
        name: "LC WAIKIKI",
        category: "Giyim",
        floor: "1. Kat",
        description: "Türkiye'nin moda perakendecisi lideri LC Waikiki, 'İyi giyinmek herkesin hakkı' misyonuyla her yaşa ve her tarza uygun koleksiyonlarını uygun fiyatlarla sunuyor.",
        image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&q=80",
        logo: "https://placehold.co/200x200?text=LCW",
        phone: "0(312) 541 20 20",
        hours: "10:00 - 22:00",
        website: "https://www.lcwaikiki.com",
        instagram: "@lcwaikiki"
    };

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Image */}
            <div className="relative w-full h-[50vh] bg-gray-100">
                <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="container mx-auto">
                        <h1 className="text-5xl font-bold text-white mb-2">{brand.name}</h1>
                        <p className="text-xl text-white/90 font-medium">{brand.category}</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Left Content */}
                    <div className="w-full md:w-2/3 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Hakkında</h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {brand.description}
                            </p>
                        </div>

                        {/* Gallery Mockup */}
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Koleksiyonlar</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                                        <Image
                                            src={`https://images.unsplash.com/photo-${i === 1 ? '1515886657613-9f3515b0c78f' : i === 2 ? '1529139574466-a302d2752424' : '1483985988355-763728e1935b'}?w=400&q=80`}
                                            alt="Gallery"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-full md:w-1/3">
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 space-y-6 sticky top-32">
                            <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm p-2">
                                    {/* Logo Placeholder */}
                                    <span className="font-bold text-xs">{brand.name.substring(0, 3)}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{brand.name}</h3>
                                    <span className="text-sm text-slate-500">{brand.floor}</span>
                                </div>
                            </div>

                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-slate-600">
                                    <Clock className="w-5 h-5 text-red-600 mt-0.5" />
                                    <div>
                                        <span className="block font-medium text-slate-900">Çalışma Saatleri</span>
                                        <span className="text-sm">{brand.hours}</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-slate-600">
                                    <Phone className="w-5 h-5 text-red-600 mt-0.5" />
                                    <div>
                                        <span className="block font-medium text-slate-900">Telefon</span>
                                        <span className="text-sm">{brand.phone}</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-slate-600">
                                    <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
                                    <div>
                                        <span className="block font-medium text-slate-900">Konum</span>
                                        <span className="text-sm">{brand.floor}</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-slate-600">
                                    <Globe className="w-5 h-5 text-red-600 mt-0.5" />
                                    <div>
                                        <span className="block font-medium text-slate-900">Web Sitesi</span>
                                        <a href={brand.website} target="_blank" className="text-sm hover:underline">{brand.website}</a>
                                    </div>
                                </li>
                            </ul>

                            <button className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
                                Mağaza Konumu
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
