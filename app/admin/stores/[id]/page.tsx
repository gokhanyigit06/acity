'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Sliders, MapPin, Phone, ImageIcon, Store as StoreIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Store {
    id: number;
    name: string;
    category: string;
    floor: string;
    phone: string;
    logo_url: string;
    description: string;
}

interface Category {
    id: number;
    name: string;
}

export default function EditStorePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [store, setStore] = useState<Store | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]); // Multi-category selection
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    // ... (keep useEffects)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0] || !store) return;

        const file = e.target.files[0];
        setUploading(true);
        setMessage(null);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `logos/${Date.now()}-${store.id}.${fileExt}`;

            // Upload
            const { error: uploadError } = await supabase.storage
                .from('image')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get URL
            const { data: { publicUrl } } = supabase.storage
                .from('image')
                .getPublicUrl(fileName);

            // Update local state
            setStore({ ...store, logo_url: publicUrl });
            setMessage({ type: 'success', text: 'Logo yüklendi! Kaydetmeyi unutmayın.' });

        } catch (error: any) {
            console.error('Upload Error:', error);
            setMessage({ type: 'error', text: 'Dosya yüklenirken hata oluştu.' });
        } finally {
            setUploading(false);
        }
    };

    // ... (keep toggleCategory & handleSave) 
    // Wait, I should implement the handler inside the component body, but I can't overwrite the whole component with replace_file_content easily due to size.
    // I will split this into two edits.
    // First edit: Add state and function handler. 
    // Second edit: Update JSX.
    // Actually I can try to do it smart.

    // Edit 1: Add state variables and `handleFileUpload` function.
    // I will replace the state definition block.


    // Check Auth & Fetch Data
    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            router.push('/admin');
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch Store
                const { data: storeData, error: storeError } = await supabase
                    .from('stores')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (storeError) throw storeError;
                setStore(storeData);

                // Fetch Categories
                const { data: catData, error: catError } = await supabase
                    .from('categories')
                    .select('*')
                    .order('name');

                if (catError) throw catError;
                setCategories(catData || []);

                // Fetch Store's Selected Categories from junction table
                const { data: storeCatData, error: storeCatError } = await supabase
                    .from('store_categories')
                    .select('category_id')
                    .eq('store_id', id);

                if (storeCatError) throw storeCatError;
                const categoryIds = storeCatData?.map(sc => sc.category_id) || [];
                setSelectedCategories(categoryIds);

            } catch (error) {
                console.error('Error fetching data:', error);
                setMessage({ type: 'error', text: 'Veri yüklenirken hata oluştu.' });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, router]);

    const toggleCategory = (categoryId: number) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!store) return;

        setSaving(true);
        setMessage(null);

        if (selectedCategories.length === 0) {
            setMessage({ type: 'error', text: 'En az bir kategori seçmelisiniz!' });
            setSaving(false);
            return;
        }

        // Use first selected category as primary category for backward compatibility
        const primaryCategory = categories.find(c => c.id === selectedCategories[0])?.name || '';

        try {
            // Update store
            const { error: storeError } = await supabase
                .from('stores')
                .update({
                    name: store.name,
                    category: primaryCategory,
                    floor: store.floor,
                    phone: store.phone,
                    logo_url: store.logo_url,
                    description: store.description
                })
                .eq('id', id);

            if (storeError) throw storeError;

            // Delete existing category associations
            const { error: deleteError } = await supabase
                .from('store_categories')
                .delete()
                .eq('store_id', id);

            if (deleteError) throw deleteError;

            // Insert new category associations
            const categoryInserts = selectedCategories.map(categoryId => ({
                store_id: parseInt(id),
                category_id: categoryId
            }));

            const { error: categoryError } = await supabase
                .from('store_categories')
                .insert(categoryInserts);

            if (categoryError) throw categoryError;

            setMessage({ type: 'success', text: 'Değişiklikler başarıyla kaydedildi!' });

            // Optional: Redirect back after delay
            // setTimeout(() => router.push('/admin/dashboard'), 1500);

        } catch (error) {
            console.error('Error updating store:', error);
            setMessage({ type: 'error', text: 'Kaydederken bir sorun oluştu.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;
    if (!store) return <div className="p-10 text-center text-red-500">Mağaza bulunamadı.</div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto max-w-3xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">Mağaza Düzenle</h1>
                            <p className="text-xs text-slate-500">ID: {store.id}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto max-w-3xl px-6 py-8">
                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center justify-center font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">

                    {/* Basic Info Card */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                            <StoreIcon className="w-5 h-5 text-red-600" />
                            <h2 className="font-semibold text-slate-800">Temel Bilgiler</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Mağaza Adı</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    value={store.name}
                                    onChange={e => setStore({ ...store, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-slate-700">Kategoriler (Birden fazla seçebilirsiniz)</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
                                    {categories.map(cat => (
                                        <label
                                            key={cat.id}
                                            className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat.id)}
                                                onChange={() => toggleCategory(cat.id)}
                                                className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
                                            />
                                            <span className="text-sm text-slate-700">{cat.name}</span>
                                        </label>
                                    ))}
                                </div>
                                {selectedCategories.length > 0 && (
                                    <p className="text-xs text-slate-500 mt-2">
                                        {selectedCategories.length} kategori seçildi
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Location & Contact Card */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                            <MapPin className="w-5 h-5 text-red-600" />
                            <h2 className="font-semibold text-slate-800">Konum & İletişim</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Kat Bilgisi</label>
                                <select
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white"
                                    value={store.floor || ''}
                                    onChange={e => setStore({ ...store, floor: e.target.value })}
                                >
                                    <option value="">Seçiniz</option>
                                    <option value="Kat -2">Kat -2</option>
                                    <option value="Kat -1">Kat -1</option>
                                    <option value="Zemin Kat">Zemin Kat</option>
                                    <option value="Kat 1">Kat 1</option>
                                    <option value="Kat 2">Kat 2</option>
                                    <option value="Dış Alan">Dış Alan</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Telefon Numarası</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full pl-9 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                        placeholder="0(312) ..."
                                        value={store.phone || ''}
                                        onChange={e => setStore({ ...store, phone: e.target.value })}
                                    />
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Media Card */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                            <ImageIcon className="w-5 h-5 text-red-600" />
                            <h2 className="font-semibold text-slate-800">Medya</h2>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Logo URL</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm font-mono text-slate-600"
                                    placeholder="https://..."
                                    value={store.logo_url || ''}
                                    onChange={e => setStore({ ...store, logo_url: e.target.value })}
                                />
                                <label className={`cursor-pointer bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                    />
                                    <ImageIcon className="w-4 h-4" />
                                    {uploading ? '...' : 'Yükle'}
                                </label>
                            </div>
                            {store.logo_url && (
                                <div className="mt-4 p-4 border border-slate-100 rounded-lg bg-slate-50 flex items-center justify-center">
                                    <img src={store.logo_url} alt="Önizleme" className="max-h-20 object-contain" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                        </button>
                    </div>

                </form>
            </main>
        </div>
    );
}
