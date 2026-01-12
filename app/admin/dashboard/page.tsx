'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Edit, Trash2, Plus, LogOut, Settings, Upload, FileSpreadsheet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Types
interface Store {
    id: number;
    name: string;
    category: string;
    floor: string;
    phone: string;
}

export default function AdminDashboard() {
    const [stores, setStores] = useState<Store[]>([]);
    const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const router = useRouter();

    // Check Auth
    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            router.push('/admin');
        }
    }, [router]);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Stores
                const { data: storesData, error: storesError } = await supabase
                    .from('stores')
                    .select('*')
                    .order('name', { ascending: true });

                if (storesError) throw storesError;
                if (storesData) setStores(storesData);

                // Fetch Categories
                const { data: catData, error: catError } = await supabase
                    .from('categories')
                    .select('*')
                    .order('name');

                if (catError) throw catError;
                if (catData) setCategories(catData);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        router.push('/admin');
    };

    const filteredStores = stores.filter(store => {
        const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? store.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Top Bar */}
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="text-xl font-bold text-red-600">ACITY ADMIN</div>
                    <span className="text-sm text-slate-400">|</span>
                    <span className="text-sm font-medium">Mağaza Yönetimi</span>
                </div>
                <div className="flex items-center">
                    <Link href="/admin/settings" className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors mr-6">
                        <Settings className="w-4 h-4" /> Site Ayarları
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors">
                        <LogOut className="w-4 h-4" /> Çıkış Yap
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                {/* Actions Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white appearance-none"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">Tüm Kategoriler</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative w-full md:w-80">
                            <input
                                type="text"
                                placeholder="Mağaza ara..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            href="/admin/bulk-stores"
                            className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                        >
                            <FileSpreadsheet className="w-5 h-5" />
                            Excel Yükle
                        </Link>
                        <Link
                            href="/admin/bulk-logos"
                            className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                        >
                            <Upload className="w-5 h-5" />
                            Toplu Logo
                        </Link>
                        <Link
                            href="/admin/stores/new"
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5" />
                            Yeni Mağaza
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-sm text-slate-500 mb-1">Toplam Mağaza</div>
                        <div className="text-3xl font-bold text-slate-800">{stores.length}</div>
                    </div>
                    {/* Add more stats if needed */}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                <th className="px-6 py-4">Mağaza Adı</th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4">Kat</th>
                                <th className="px-6 py-4">Telefon</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStores.map(store => (
                                <tr key={store.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{store.name}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                            {store.category || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{store.floor}</td>
                                    <td className="px-6 py-4 text-slate-600 font-mono text-sm">{store.phone || '-'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin/stores/${store.id}`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Düzenle"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            {/* Delete functionality to be added later */}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredStores.length === 0 && (
                        <div className="p-12 text-center text-slate-500">
                            Mağaza bulunamadı.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
