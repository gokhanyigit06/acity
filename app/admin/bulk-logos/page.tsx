'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Upload, AlertCircle, CheckCircle, FileUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Store {
    id: number;
    name: string;
    logo_url: string;
}

interface FileMatch {
    file: File;
    storeId: number | null;
    storeName: string | null;
    status: 'pending' | 'uploading' | 'success' | 'error' | 'skipped';
    matchConfidence: number;
}

export default function BulkLogoPage() {
    const [stores, setStores] = useState<Store[]>([]);
    const [files, setFiles] = useState<FileMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    // Fetch Stores
    useEffect(() => {
        const fetchStores = async () => {
            const isAdmin = localStorage.getItem('isAdmin');
            if (!isAdmin) {
                router.push('/admin');
                return;
            }

            try {
                const { data } = await supabase
                    .from('stores')
                    .select('id, name, logo_url')
                    .order('name');
                setStores(data || []);
            } catch (error) {
                console.error('Error fetching stores:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStores();
    }, [router]);

    // File Selection Handler
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const newFiles = Array.from(e.target.files).map(file => {
            const fileName = file.name.toLowerCase().split('.')[0].replace(/[-_]/g, ' ');

            // Find best match
            // Simple logic: check if store name includes the file name or vice versa
            let bestMatch: Store | null = null;
            let maxConfidence = 0;

            for (const store of stores) {
                const storeName = store.name.toLowerCase();
                let confidence = 0;

                if (storeName === fileName) confidence = 100;
                else if (storeName.includes(fileName)) confidence = 80;
                else if (fileName.includes(storeName)) confidence = 80;
                // Basic Levenshtein could go here for better matching

                if (confidence > maxConfidence) {
                    maxConfidence = confidence;
                    bestMatch = store;
                }
            }

            return {
                file,
                storeId: bestMatch?.id || null,
                storeName: bestMatch?.name || null,
                status: 'pending' as const,
                matchConfidence: maxConfidence
            };
        });

        setFiles(prev => [...prev, ...newFiles]);
    };

    // Remove file from list
    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Update matched store manually
    const updateMatch = (index: number, storeId: string) => {
        const store = stores.find(s => s.id.toString() === storeId);
        setFiles(prev => prev.map((item, i) => {
            if (i === index) {
                return {
                    ...item,
                    storeId: store ? store.id : null,
                    storeName: store ? store.name : null,
                    matchConfidence: 100 // Manual override considered 100%
                };
            }
            return item;
        }));
    };

    // Process Uploads
    const handleUpload = async () => {
        setUploading(true);

        const itemsToUpload = files.filter(f => f.status === 'pending' && f.storeId);

        for (let i = 0; i < files.length; i++) {
            const item = files[i];
            if (item.status !== 'pending' || !item.storeId) continue;

            // Update status to uploading
            setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'uploading' } : f));

            try {
                const fileExt = item.file.name.split('.').pop();
                const fileName = `logos/${Date.now()}-${item.storeId}.${fileExt}`;

                // 1. Upload to Storage
                const { error: uploadError } = await supabase.storage
                    .from('image')
                    .upload(fileName, item.file, { upsert: true });

                if (uploadError) throw uploadError;

                // 2. Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('image')
                    .getPublicUrl(fileName);

                // 3. Update Store Record
                const { error: dbError } = await supabase
                    .from('stores')
                    .update({ logo_url: publicUrl })
                    .eq('id', item.storeId);

                if (dbError) throw dbError;

                // Success
                setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'success' } : f));

            } catch (error) {
                console.error('Upload failed for', item.file.name, error);
                setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'error' } : f));
            }
        }

        setUploading(false);
    };

    if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto max-w-4xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">Toplu Logo Yükleme</h1>
                            <p className="text-xs text-slate-500">Dosya isimlerine göre otomatik eşleştirme</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto max-w-4xl px-6 py-8">

                {/* Upload Area */}
                <div className="bg-white p-8 rounded-xl border-2 border-dashed border-slate-300 hover:border-red-400 transition-colors text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                            <Upload className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">Dosyaları Sürükleyin veya Seçin</h3>
                            <p className="text-sm text-slate-500 mt-1">Logo dosyalarının isimleri mağaza adıyla benzer olmalıdır (örn: zara.png, mavi.jpg)</p>
                        </div>
                        <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                            Dosya Seç
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileSelect} />
                        </label>
                    </div>
                </div>

                {/* Match List */}
                {files.length > 0 && (
                    <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-semibold text-slate-800">Eşleşmeler ({files.length})</h3>
                            <button
                                onClick={handleUpload}
                                disabled={uploading || files.every(f => f.status === 'success')}
                                className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FileUp className="w-4 h-4" />
                                {uploading ? 'Yükleniyor...' : 'Yüklemeyi Başlat'}
                            </button>
                        </div>
                        <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                            {files.map((item, idx) => (
                                <div key={idx} className="px-6 py-3 flex items-center gap-4 hover:bg-slate-50">
                                    {/* Status Icon */}
                                    <div className="w-6 shrink-0">
                                        {item.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                                        {item.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                                        {item.status === 'uploading' && <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />}
                                        {item.status === 'pending' && <div className="w-2 h-2 bg-slate-300 rounded-full ml-1.5" />}
                                    </div>

                                    {/* File Name */}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm truncate" title={item.file.name}>{item.file.name}</div>
                                        <div className="text-xs text-slate-400">{(item.file.size / 1024).toFixed(0)} KB</div>
                                    </div>

                                    {/* Match Dropdown */}
                                    <div className="flex-1">
                                        <select
                                            className={`w-full text-sm border rounded px-2 py-1 ${!item.storeId ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                                            value={item.storeId || ''}
                                            onChange={(e) => updateMatch(idx, e.target.value)}
                                            disabled={item.status === 'success' || item.status === 'uploading'}
                                        >
                                            <option value="">Eşleşme Bulunamadı</option>
                                            {stores.map(store => (
                                                <option key={store.id} value={store.id}>
                                                    {store.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Remove Action */}
                                    <button
                                        onClick={() => removeFile(idx)}
                                        className="text-slate-400 hover:text-red-500"
                                        disabled={item.status === 'uploading'}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
