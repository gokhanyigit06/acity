'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Sliders, MapPin, Phone, ImageIcon, Store as StoreIcon } from 'lucide-react';
import Link from 'next/link';

interface Category {
    id: number;
    name: string;
}

// Temporary slugify function if utils import fails (or we simply add it here for safety)
function simpleSlugify(text: string) {
    const trMap: { [key: string]: string } = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'i': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'C', 'Ğ': 'G', 'I': 'I', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
    };
    let slug = text.replace(/[çğıiöşüÇĞIİÖŞÜ]/g, (char) => trMap[char] || char);
    return slug.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
}

export default function NewStorePage() {
    const [name, setName] = useState('');
    const [category, setCategory] = useState(''); // Primary category for backward compatibility
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]); // Multi-category selection
    const [floor, setFloor] = useState('');
    const [phone, setPhone] = useState('');
    const [logoUrl, setLogoUrl] = useState('');

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    // Check Auth & Fetch Categories
    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            router.push('/admin');
            return;
        }

        const fetchCategories = async () => {
            try {
                const { data, error } = await supabase
                    .from('categories')
                    .select('*')
                    .order('name');

                if (error) throw error;
                setCategories(data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [router]);

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
        setSaving(true);
        setMessage(null);

        if (selectedCategories.length === 0) {
            setMessage({ type: 'error', text: 'En az bir kategori seçmelisiniz!' });
            setSaving(false);
            return;
        }

        const slug = simpleSlugify(name);
        // Use first selected category as primary category for backward compatibility
        const primaryCategory = categories.find(c => c.id === selectedCategories[0])?.name || '';

        try {
            // Insert store
            const { data: storeData, error: storeError } = await supabase
                .from('stores')
                .insert([
                    {
                        name,
                        slug,
                        category: primaryCategory,
                        floor,
                        phone,
                        logo_url: logoUrl
                    }
                ])
                .select()
                .single();

            if (storeError) {
                if (storeError.code === '23505') { // Unique violation
                    throw new Error('Bu isimde bir mağaza zaten var!');
                }
                throw storeError;
            }

            // Insert into store_categories junction table
            const categoryInserts = selectedCategories.map(categoryId => ({
                store_id: storeData.id,
                category_id: categoryId
            }));

            const { error: categoryError } = await supabase
                .from('store_categories')
                .insert(categoryInserts);

            if (categoryError) throw categoryError;

            setMessage({ type: 'success', text: 'Mağaza başarıyla oluşturuldu!' });
            // Redirect after success
            setTimeout(() => router.push('/admin/dashboard'), 1500);

        } catch (error: any) {
            console.error('Error creating store:', error);
            setMessage({ type: 'error', text: error.message || 'Oluştururken bir sorun oluştu.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

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
                            <h1 className="text-xl font-bold text-slate-900">Yeni Mağaza Ekle</h1>
                            <p className="text-xs text-slate-500">Yeni bir mağaza kaydı oluşturun</p>
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
                                    placeholder="Örn: Zara"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
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
                                    value={floor}
                                    onChange={e => setFloor(e.target.value)}
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
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
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
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm font-mono text-slate-600"
                                placeholder="https://..."
                                value={logoUrl}
                                onChange={e => setLogoUrl(e.target.value)}
                            />
                            {logoUrl && (
                                <div className="mt-4 p-4 border border-slate-100 rounded-lg bg-slate-50 flex items-center justify-center">
                                    <img src={logoUrl} alt="Önizleme" className="max-h-20 object-contain" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'Oluşturuluyor...' : 'Mağazayı Oluştur'}
                        </button>
                    </div>

                </form>
            </main>
        </div>
    );
}
