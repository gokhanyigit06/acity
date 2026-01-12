'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

export interface Brand {
    id: number;
    name: string;
    logoUrl?: string;
}

const DEFAULT_BRANDS: Brand[] = [
    { id: 1, name: "GUESS", logoUrl: "" },
    { id: 2, name: "BOSS", logoUrl: "" },
    { id: 3, name: "Calvin Klein", logoUrl: "" },
    { id: 4, name: "GAP", logoUrl: "" },
    { id: 5, name: "Columbia", logoUrl: "" },
    { id: 6, name: "SuperStep", logoUrl: "" },
    { id: 7, name: "Boyner", logoUrl: "" },
    { id: 8, name: "Marks & Spencer", logoUrl: "" },
    { id: 9, name: "Tommy Hilfiger", logoUrl: "" },
    { id: 10, name: "Mavi", logoUrl: "" },
    { id: 11, name: "Network", logoUrl: "" },
    { id: 12, name: "Beymen", logoUrl: "" }
];

interface FeaturedBrandsProps {
    initialData?: Brand[] | null;
}

export function FeaturedBrands({ initialData }: FeaturedBrandsProps) {
    const [brands, setBrands] = useState<Brand[] | null>(initialData || null);

    useEffect(() => {
        if (initialData) return;

        const fetchSettings = async () => {
            try {
                const { data } = await supabase
                    .from('site_settings')
                    .select('value')
                    .eq('key', 'featured_brands')
                    .single();

                if (data && Array.isArray(data.value)) {
                    setBrands(data.value);
                }
            } catch (error) {
                console.error('Error fetching featured brands:', error);
            }
        };

        fetchSettings();
    }, [initialData]);

    const displayBrands = brands || DEFAULT_BRANDS;

    return (
        <section className="pb-10 pt-4 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2 tracking-tight">Mağazalar</h2>
                    <p className="text-slate-500 font-medium">
                        Her adımıyla Ankara’nın prestijini parlatan Acity!
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {displayBrands.map((brand, idx) => (
                        <div key={idx} className="group aspect-[4/3] flex items-center justify-center p-6 border border-slate-200 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white relative overflow-hidden">
                            {brand.logoUrl ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={brand.logoUrl}
                                        alt={brand.name}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </div>
                            ) : (
                                <span className="text-lg font-bold text-slate-800 text-center">
                                    {brand.name}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/stores" className="inline-block px-10 py-3 bg-black text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-colors shadow-lg">
                        Tüm Markalar
                    </Link>
                </div>
            </div>
        </section>
    );
}
