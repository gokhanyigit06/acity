'use client';

import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MapPin, Phone, Clock, Instagram, Globe } from 'lucide-react';

export default function DiningDetailPage({ params }: { params: { slug: string } }) {
    // In a real app, fetch data based on slug. For now, static mock.
    const brand = {
        name: "Burger King",
        category: "Fast Food",
        floor: "2. Kat",
        description: "Dünyanın en büyük fast-food zincirlerinden biri olan Burger King, alevde ızgara ateşinin kralı! Eşsiz lezzetleri ve doyurucu menüleriyle Acity AVM'de.",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1200&q=80",
        logo: "https://placehold.co/200x200?text=BK",
        phone: "0(312) 541 00 00",
        hours: "10:00 - 22:00",
        website: "https://www.burgerking.com.tr",
        instagram: "@burgerkingtr"
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
                <div className="absolute inset-0 bg-black/30" />
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
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Galeri</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                                        <Image
                                            src={`https://images.unsplash.com/photo-${i === 1 ? '1561758033-d89a9ad46330' : i === 2 ? '1568901346375-23c9450c58cd' : '1550547660-d9450f859349'}?w=400&q=80`}
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
                                    <span className="font-bold text-xs">{brand.name.substring(0, 2)}</span>
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
                                Yol Tarifi Al
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
