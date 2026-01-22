'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function NewSliderPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        image_url: '',
        link: '',
        display_order: 0,
        is_active: true
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.image_url) {
                alert('Lütfen bir görsel URL girin.');
                setLoading(false);
                return;
            }

            const { error } = await supabase
                .from('event_slider')
                .insert([formData]);

            if (error) throw error;

            alert('Slider görseli başarıyla eklendi.');
            router.push('/admin/slider');
            router.refresh();
        } catch (error) {
            console.error('Error adding slider:', error);
            alert('Ekleme sırasında bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/admin/slider" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Yeni Slider Ekle</h1>
                        <p className="text-xs text-slate-500">Etkinlik sayfası için yeni bir manşet oluşturun</p>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6">

                        {/* Image URL */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-red-600" />
                                Görsel URL (Zorunlu)
                            </label>
                            <input
                                type="url"
                                name="image_url"
                                required
                                value={formData.image_url}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-mono text-sm"
                            />
                            {formData.image_url && (
                                <div className="mt-4 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-[21/9] relative">
                                    <img
                                        src={formData.image_url}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-900">Başlık (Opsiyonel)</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Örn: Kış İndirimleri"
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                            />
                        </div>

                        {/* Link */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-900">Yönlendirme Linki (Opsiyonel)</label>
                            <input
                                type="text"
                                name="link"
                                value={formData.link}
                                onChange={handleChange}
                                placeholder="/magazalar/nike veya https://..."
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Display Order */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-900">Sıralama</label>
                                <input
                                    type="number"
                                    name="display_order"
                                    value={formData.display_order}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                                />
                            </div>

                            {/* Active Status */}
                            <div className="space-y-2 flex flex-col justify-end">
                                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-red-600 rounded focus:ring-red-500 border-gray-300"
                                    />
                                    <span className="font-bold text-slate-900">Aktif</span>
                                </label>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
                            <Link href="/admin/slider" className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-colors">
                                İptal
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-red-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Kaydediliyor...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Kaydet
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
}
