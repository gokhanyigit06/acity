'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Trash2, Plus, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SliderItem {
    id: number;
    title: string;
    image_url: string;
    link: string;
    display_order: number;
    is_active: boolean;
}

export default function SliderAdminPage() {
    const [sliders, setSliders] = useState<SliderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            router.push('/admin');
            return;
        }

        fetchSliders();
    }, [router]);

    const fetchSliders = async () => {
        try {
            const { data, error } = await supabase
                .from('event_slider')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            if (data) setSliders(data);
        } catch (error) {
            console.error('Error fetching sliders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Bu slider görselini silmek istediğinize emin misiniz?')) return;

        try {
            const { error } = await supabase
                .from('event_slider')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setSliders(sliders.filter(s => s.id !== id));
        } catch (error) {
            console.error('Error deleting slider:', error);
            alert('Silme işleminde hata oluştu.');
        }
    };

    if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Slider Yönetimi</h1>
                        <p className="text-xs text-slate-500">Etkinlik sayfasındaki slider alanını düzenleyin</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/admin/slider/new" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm">
                        <Plus className="w-5 h-5" />
                        Yeni Ekle
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                {/* List */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                <th className="px-6 py-4">Görsel</th>
                                <th className="px-6 py-4">Başlık</th>
                                <th className="px-6 py-4">Sıra</th>
                                <th className="px-6 py-4">Link</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sliders.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-10 rounded overflow-hidden bg-slate-100 relative">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{item.title || '-'}</td>
                                    <td className="px-6 py-4 text-slate-600">{item.display_order}</td>
                                    <td className="px-6 py-4 text-blue-600 text-sm truncate max-w-[200px]">{item.link || '-'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {/* Edit could be added here later */}
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Sil"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {sliders.length === 0 && (
                        <div className="p-12 text-center text-slate-500">
                            Slider görseli bulunamadı.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
