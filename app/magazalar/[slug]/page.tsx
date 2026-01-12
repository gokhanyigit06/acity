'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { Phone, MapPin, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Store {
    id: number;
    name: string;
    category: string;
    floor: string;
    phone: string;
    logo_url: string;
    slug: string;
}

export default function StoreDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [store, setStore] = useState<Store | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStore = async () => {
            if (!params.slug) return;

            try {
                const { data, error } = await supabase
                    .from('stores')
                    .select('*')
                    .eq('slug', params.slug)
                    .single();

                if (error) throw error;
                setStore(data);
            } catch (err) {
                console.error('Error fetching store:', err);
                // Optionally redirect to 404 or list
                // router.push('/magazalar'); 
            } finally {
                setLoading(false);
            }
        };

        fetchStore();
    }, [params.slug, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-slate-400">Yükleniyor...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!store) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <h1 className="text-2xl font-bold text-slate-900">Mağaza Bulunamadı</h1>
                    <Link href="/magazalar" className="text-red-600 hover:text-red-700 flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Mağazalara Dön
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white flex flex-col">
            <Navbar />

            {/* Breadcrumb / Back Navigation */}
            <div className="bg-slate-50 border-b border-slate-100">
                <div className="container mx-auto px-4 py-4">
                    <Link
                        href="/magazalar"
                        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Tüm Mağazalar
                    </Link>
                </div>
            </div>

            <div className="flex-1 container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto">

                    {/* Minimal & Elegant Header Card */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden md:flex">

                        {/* Logo Section */}
                        <div className="md:w-5/12 bg-slate-50 p-12 flex items-center justify-center border-r border-slate-100">
                            {store.logo_url ? (
                                <img
                                    src={store.logo_url}
                                    alt={store.name}
                                    className="w-full max-h-[200px] object-contain drop-shadow-sm transition-transform hover:scale-105 duration-500"
                                />
                            ) : (
                                <span className="text-4xl font-bold text-slate-300">{store.name.substring(0, 2).toUpperCase()}</span>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="md:w-7/12 p-10 md:p-14 flex flex-col justify-center space-y-8">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">{store.name}</h1>
                                <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-sm font-bold tracking-wider uppercase rounded-full">
                                    {store.category}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {/* Floor Information */}
                                <div className="flex items-center gap-4 text-slate-600 group">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase">Konum</p>
                                        <p className="text-lg font-medium">{store.floor || "Belirtilmemiş"}</p>
                                    </div>
                                </div>

                                {/* Phone Information */}
                                <div className="flex items-center gap-4 text-slate-600 group">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase">İletişim</p>
                                        {store.phone ? (
                                            <a href={`tel:${store.phone.replace(/\s/g, '')}`} className="text-lg font-medium hover:text-red-600 transition-colors">
                                                {store.phone}
                                            </a>
                                        ) : (
                                            <p className="text-lg font-medium text-slate-400">-</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    );
}
