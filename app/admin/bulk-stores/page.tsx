'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Upload, FileUp, AlertCircle, CheckCircle, Download } from 'lucide-react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';

interface ExtractedStore {
    name: string;
    category: string;
    floor: string;
    phone: string;
    description: string;
    logo_url: string;
    status: 'pending' | 'success' | 'error' | 'skipped';
    message?: string;
}

export default function BulkStoresPage() {
    const [stores, setStores] = useState<ExtractedStore[]>([]);
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState(false);
    const router = useRouter();

    // Template Download
    const downloadTemplate = () => {
        const ws = XLSX.utils.json_to_sheet([
            {
                "Mağaza Adı": "Örnek Mağaza",
                "Kategori": "Giyim",
                "Kat": "Zemin Kat",
                "Telefon": "0312 123 45 67",
                "Açıklama": "Mağaza hakkında kısa bilgi...",
                "Logo URL": "https://..."
            }
        ]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Şablon");
        XLSX.writeFile(wb, "magaza-yukleme-sablonu.xlsx");
    };

    // File Handler
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const reader = new FileReader();

        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                const extracted: ExtractedStore[] = data.map((row: any) => ({
                    name: row['Mağaza Adı'] || row['Name'] || '',
                    category: row['Kategori'] || row['Category'] || '',
                    floor: row['Kat'] || row['Floor'] || '',
                    phone: row['Telefon'] || row['Phone'] || '',
                    description: row['Açıklama'] || row['Description'] || '',
                    logo_url: row['Logo URL'] || row['Logo'] || '',
                    status: 'pending' as ExtractedStore['status']
                })).filter(s => s.name); // Filter out empty rows

                setStores(extracted);
            } catch (err) {
                console.error("Excel parse error:", err);
                alert("Dosya okunamadı. Lütfen geçerli bir Excel dosyası yükleyin.");
            } finally {
                setLoading(false);
            }
        };

        reader.readAsBinaryString(file);
    };

    // Slug Generator
    function simpleSlugify(text: string) {
        const trMap: { [key: string]: string } = {
            'ç': 'c', 'ğ': 'g', 'ı': 'i', 'i': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
            'Ç': 'C', 'Ğ': 'G', 'I': 'I', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
        };
        let slug = text.replace(/[çğıiöşüÇĞIİÖŞÜ]/g, (char) => trMap[char] || char);
        return slug.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    }

    // Import Process
    const handleImport = async () => {
        setImporting(true);
        const newStores = [...stores];

        // Fetch categories to check existence or maybe just insert string (legacy support)
        // For simplicity, we'll try to insert using the string. Ideally we should map to IDs if using multi-category.
        // But since we still have the `category` text column on stores, we can use that for now.
        // We will ALSO try to check if category exists in `categories` table, if not, create it? 
        // Or just map to existing?
        // Let's first get all categories to map.

        let categoriesMap: { [key: string]: number } = {};
        const { data: catData } = await supabase.from('categories').select('id, name');
        if (catData) {
            catData.forEach(c => categoriesMap[c.name.toLowerCase()] = c.id);
        }

        for (let i = 0; i < newStores.length; i++) {
            const store = newStores[i];
            if (store.status !== 'pending') continue;

            try {
                const slug = simpleSlugify(store.name);

                // 1. Insert Store
                const { data: insertedStore, error } = await supabase
                    .from('stores')
                    .insert([{
                        name: store.name,
                        slug: slug,
                        category: store.category,
                        floor: store.floor,
                        phone: store.phone,
                        description: store.description,
                        logo_url: store.logo_url
                    }])
                    .select()
                    .single();

                if (error) {
                    if (error.code === '23505') { // Unique violation
                        newStores[i].status = 'error';
                        newStores[i].message = 'Bu mağaza zaten var.';
                        continue;
                    }
                    throw error;
                }

                // 2. Link Category (if matches existing category)
                if (store.category && insertedStore) {
                    const catId = categoriesMap[store.category.toLowerCase()];
                    if (catId) {
                        await supabase.from('store_categories').insert({
                            store_id: insertedStore.id,
                            category_id: catId
                        });
                    }
                    // If category doesn't exist, we skip linking ID but textual category is already in `stores` table.
                }

                newStores[i].status = 'success';
            } catch (err: any) {
                console.error(err);
                newStores[i].status = 'error';
                newStores[i].message = err.message || 'Hata oluştu';
            }

            // Update UI every few items to show progress (optional, react handles batching)
            setStores([...newStores]);
        }

        setImporting(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto max-w-5xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">Toplu Mağaza Yükle (Excel)</h1>
                            <p className="text-xs text-slate-500">Excel dosyasından mağaza listesi içe aktar</p>
                        </div>
                    </div>
                    <button
                        onClick={downloadTemplate}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Örnek Şablon İndir
                    </button>
                </div>
            </header>

            <main className="container mx-auto max-w-5xl px-6 py-8">

                {/* Upload Area */}
                {stores.length === 0 && (
                    <div className="bg-white p-12 rounded-xl border-2 border-dashed border-slate-300 hover:border-green-400 transition-colors text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                <FileUp className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">Excel Dosyası Yükleyin</h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    .xlsx veya .xls formatında
                                </p>
                            </div>
                            <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg">
                                {loading ? 'Okunuyor...' : 'Dosya Seç'}
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    disabled={loading}
                                />
                            </label>
                        </div>
                    </div>
                )}

                {/* Preview List */}
                {stores.length > 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="font-semibold text-slate-800">Önizleme ({stores.length} Mağaza)</h3>
                                <p className="text-xs text-slate-500">Listeyi kontrol ettikten sonra aktarımı başlatın</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setStores([])}
                                    className="text-slate-500 hover:text-red-600 px-4 py-2 font-medium text-sm"
                                    disabled={importing}
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleImport}
                                    disabled={importing || stores.every(s => s.status === 'success')}
                                    className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-6 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {importing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Aktarılıyor...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            Aktarımı Başlat
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-4 py-3 font-medium text-slate-500">Durum</th>
                                        <th className="px-4 py-3 font-medium text-slate-500">Mağaza Adı</th>
                                        <th className="px-4 py-3 font-medium text-slate-500">Kategori</th>
                                        <th className="px-4 py-3 font-medium text-slate-500">Kat</th>
                                        <th className="px-4 py-3 font-medium text-slate-500">Telefon</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {stores.map((store, idx) => (
                                        <tr key={idx} className={`hover:bg-slate-50 ${store.status === 'error' ? 'bg-red-50/50' : ''}`}>
                                            <td className="px-4 py-3 w-10">
                                                {store.status === 'pending' && <div className="w-2 h-2 bg-slate-300 rounded-full" />}
                                                {store.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                                                {store.status === 'error' && (
                                                    <div className="group relative">
                                                        <AlertCircle className="w-5 h-5 text-red-500 cursor-help" />
                                                        <div className="absolute left-6 top-0 hidden group-hover:block bg-red-800 text-white text-xs p-2 rounded whitespace-nowrap z-50">
                                                            {store.message}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-slate-900">{store.name}</td>
                                            <td className="px-4 py-3 text-slate-600">{store.category}</td>
                                            <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{store.floor}</td>
                                            <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{store.phone}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
