import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Brand {
    id: number;
    name: string;
    category: string;
}

export async function FeaturedBrands() {
    let brands: Brand[] = [];

    try {
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            const { data, error } = await supabase
                .from('brands')
                .select('id, name, category')
                .limit(6);

            if (!error && data) {
                brands = data;
            }
        }
    } catch (e) {
        console.error("Supabase connection failed", e);
    }

    // Fallback static data extension for 12 items display
    if (brands.length < 12) {
        const moreBrands = [
            { id: 7, name: "GUESS", category: "Giyim" },
            { id: 8, name: "BOSS", category: "Giyim" },
            { id: 9, name: "Calvin Klein", category: "Giyim" },
            { id: 10, name: "GAP", category: "Giyim" },
            { id: 11, name: "Columbia", category: "Spor" },
            { id: 12, name: "SuperStep", category: "Ayakkabı" },
            { id: 13, name: "Boyner", category: "Giyim" },
            { id: 14, name: "Marks & Spencer", category: "Giyim" },
            { id: 15, name: "Tommy Hilfiger", category: "Giyim" },
            { id: 16, name: "Mavi", category: "Giyim" }
        ];
        brands = [...brands, ...moreBrands].slice(0, 12);
    }

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
                    {brands.map((brand) => (
                        <div key={brand.id} className="group aspect-[4/3] flex items-center justify-center p-6 border border-slate-200 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white">
                            {/* Placeholder for Logo - In real app, use Image component */}
                            <span className="text-lg font-bold text-slate-800 text-center">
                                {brand.name}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/stores" className="inline-block px-10 py-3 bg-black text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-colors shadow-lg">
                        Tüm Markalar
                    </Link>
                    {/* Decorative stars could be added around the button via pseudo-elements or absolute spans if desired */}
                </div>
            </div>
        </section>
    );
}
