import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const DINING_BRANDS = [
    "Burger King",
    "Terra Pizza",
    "Meywa Waffle",
    "Starbucks",
    "Pidem",
    "Tavuk Dünyası"
];

const DINING_IMAGES = [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80", // Burger
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80", // Pizza
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80", // Waffle/Dessert
];

export function DiningSection() {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Content */}
                    <div className="w-full lg:w-1/4 flex flex-col justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-8">Cafe & Restorant</h2>
                            <ul className="space-y-4">
                                {DINING_BRANDS.map((brand, idx) => (
                                    <li key={idx} className="text-slate-600 font-medium hover:text-red-600 transition-colors cursor-pointer">
                                        {brand}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-8 lg:mt-0">
                            <Link href="/dining" className="inline-flex items-center text-red-600 font-bold hover:gap-2 transition-all group">
                                Tüm Restoranlar
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Images Grid */}
                    <div className="w-full lg:w-3/4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {DINING_IMAGES.map((img, idx) => (
                                <div key={idx} className="relative aspect-[4/5] rounded-2xl overflow-hidden group">
                                    <Image
                                        src={img}
                                        alt="Delicious Food"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
