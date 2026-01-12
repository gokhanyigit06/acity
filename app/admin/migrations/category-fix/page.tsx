'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function MigrationPage() {
    const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
    const [log, setLog] = useState<string[]>([]);
    const [count, setCount] = useState(0);

    const runMigration = async () => {
        setStatus('running');
        setLog([]);

        try {
            // 1. Get count of items to migrate
            const { count: pendingCount, error: countError } = await supabase
                .from('stores')
                .select('*', { count: 'exact', head: true })
                .eq('category', 'Yeme-İçme');

            if (countError) throw countError;

            setLog(prev => [...prev, `Found ${pendingCount} stores with category 'Yeme-İçme'.`]);

            if (pendingCount === 0 || pendingCount === null) {
                setLog(prev => [...prev, 'No stores to migrate.']);
                setStatus('success');
                return;
            }

            // 2. Perform Update
            const { error: updateError } = await supabase
                .from('stores')
                .update({ category: 'Cafe & Restoran' })
                .eq('category', 'Yeme-İçme');

            if (updateError) throw updateError;

            setCount(pendingCount);
            setLog(prev => [...prev, `Successfully updated ${pendingCount} stores to 'Cafe & Restoran'.`]);
            setStatus('success');
        } catch (error: any) {
            console.error(error);
            setLog(prev => [...prev, `Error: ${error.message}`]);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                    <Link href="/admin/dashboard" className="p-2 hover:bg-slate-100 rounded-full">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Link>
                    <h1 className="text-xl font-bold">Kategori Göçü (Migration)</h1>
                </div>

                <div className="p-8 text-center space-y-6">
                    <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800 text-sm">
                        Bu işlem "Yeme-İçme" kategorisindeki tüm mağazaları "Cafe & Restoran" kategorisine taşıyacaktır.
                    </div>

                    {status === 'idle' && (
                        <button
                            onClick={runMigration}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg flex items-center justify-center gap-2 mx-auto"
                        >
                            <RefreshCw className="w-5 h-5" />
                            İşlemi Başlat
                        </button>
                    )}

                    {status === 'running' && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                            <p className="text-slate-500">İşlem yapılıyor...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center gap-4 text-green-600">
                            <CheckCircle className="w-12 h-12" />
                            <p className="font-bold text-lg">İşlem Başarılı!</p>
                            <p className="text-slate-600">Toplam {count} mağaza güncellendi.</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center gap-4 text-red-600">
                            <AlertCircle className="w-12 h-12" />
                            <p className="font-bold text-lg">Hata Oluştu!</p>
                        </div>
                    )}

                    <div className="mt-8 text-left bg-slate-900 text-slate-300 p-4 rounded-lg font-mono text-xs h-40 overflow-y-auto">
                        {log.map((line, i) => (
                            <div key={i}>{`> ${line}`}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
