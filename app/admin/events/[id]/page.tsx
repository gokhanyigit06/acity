'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Upload, Image as ImageIcon } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// Simple slugify function
const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '');      // Trim - from end of text
};

export default function EventFormPage() {
    const router = useRouter();
    const params = useParams();
    const isEditMode = params.id && params.id !== 'new'; // Wait, 'new' is a separate folder or handled by [id] if generic? 
    // Actually I mapped /admin/events/new to this page if I place it in [id]?
    // No, I planned separate files but maybe I can share component.
    // Let's create `app/admin/events/new/page.tsx` and `app/admin/events/[id]/page.tsx` separately or re-export.
    // I am writing this content for `app/admin/events/[id]/page.tsx`.
    // I also need to provide content for `app/admin/events/new/page.tsx`.
    // Actually, I can use a generic component.

    // Let's assume this code is for [id].
    // If [id] == 'new' (collision?), Next.js prefers static routes over dynamic.
    // So `new/page.tsx` works for /admin/events/new.
    // `[id]/page.tsx` works for /admin/events/123.

    // I'll make a shared component or just duplicate logic for simplicity in this context.

    // This file specifically: app/admin/events/[id]/page.tsx

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        type: 'event', // event | campaign
        date_text: '',
        time_text: '',
        location: '',
        image_url: '',
        description: '',
        content: '',
        is_active: true
    });

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            router.push('/admin');
            return;
        }

        if (params.id && params.id !== 'new') { // Although 'new' won't hit here if file structure is correct
            fetchData(params.id as string);
        } else {
            setLoading(false); // New mode
        }
    }, [router, params.id]);

    const fetchData = async (id: string) => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (data) {
                setFormData({
                    title: data.title || '',
                    slug: data.slug || '',
                    type: data.type || 'event',
                    date_text: data.date_text || '',
                    time_text: data.time_text || '',
                    location: data.location || '',
                    image_url: data.image_url || '',
                    description: data.description || '',
                    content: data.content || '',
                    is_active: data.is_active ?? true
                });
            }
        } catch (error) {
            console.error('Error fetching event:', error);
            alert('Etkinlik bulunamadı.');
            router.push('/admin/events');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `events/${fileName}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('image')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('image')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
        } catch (error: any) {
            console.error('Upload Error:', error);
            alert('Dosya yüklenemedi: ' + error.message);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Auto generate slug if empty
        let finalSlug = formData.slug;
        if (!finalSlug) {
            finalSlug = slugify(formData.title);
        }

        const payload = {
            ...formData,
            slug: finalSlug
        };

        try {
            if (params.id) {
                // Update
                const { error } = await supabase
                    .from('events')
                    .update(payload)
                    .eq('id', params.id);
                if (error) throw error;
            } else {
                // Create
                // Won't happen in this file if structured correctly, but safety check
            }

            alert('Başarıyla kaydedildi!');
            router.push('/admin/events');
        } catch (error: any) {
            console.error('Save error:', error);
            alert('Hata: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
                <div className="container mx-auto max-w-3xl flex items-center gap-4">
                    <Link href="/admin/events" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold text-slate-900">Etkinlik Düzenle</h1>
                </div>
            </header>

            <main className="container mx-auto max-w-3xl px-6 py-8">
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Başlık</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tip</label>
                            <select
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="event">Etkinlik</option>
                                <option value="campaign">Kampanya</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                            <input
                                type="text"
                                placeholder="Otomatik oluşturulur"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-slate-500"
                                value={formData.slug}
                                onChange={e => setFormData({ ...formData, slug: slugify(e.target.value) })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tarih Metni</label>
                            <input
                                type="text"
                                placeholder="Örn: 20 Ocak 2024"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                value={formData.date_text}
                                onChange={e => setFormData({ ...formData, date_text: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Saat / Süre</label>
                            <input
                                type="text"
                                placeholder="Örn: 14:00 - 16:00"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                value={formData.time_text}
                                onChange={e => setFormData({ ...formData, time_text: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Konum</label>
                            <input
                                type="text"
                                placeholder="Örn: Zemin Kat Etkinlik Alanı"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Kapak Görseli</label>
                            <div className="flex items-start gap-4">
                                <div className="w-32 h-32 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden flex-shrink-0">
                                    {formData.image_url ? (
                                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <ImageIcon className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Görsel URL veya Yükleyin"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none mb-2"
                                        value={formData.image_url}
                                        onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                    />
                                    <label className="cursor-pointer inline-flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors">
                                        <Upload className="w-4 h-4" />
                                        Görsel Yükle
                                        <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Kısa Açıklama (Listeleme İçin)</label>
                            <textarea
                                rows={3}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">İçerik (Detay Sayfası İçin)</label>
                            <textarea
                                rows={10}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none font-mono text-sm"
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                placeholder="HTML etikeleri kullanabilirsiniz. Örn: <p>Paragraf</p>"
                            />
                            <p className="text-xs text-slate-500 mt-1">Detay sayfasında görünecek uzun içerik. Basit HTML kullanabilirsiniz.</p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                                    checked={formData.is_active}
                                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                />
                                <span className="text-sm font-medium text-slate-700">Yayında</span>
                            </label>
                        </div>

                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
