'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple hardcoded check for now (DEVELOPMENT ONLY)
        // In production, use Supabase Auth or a secure backend check
        if (username === 'admin' && password === 'acity2024') {
            // Set a simple cookie or local storage to persist session loosely
            localStorage.setItem('isAdmin', 'true');
            router.push('/admin/dashboard');
        } else {
            setError('Geçersiz kullanıcı adı veya şifre');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                        <Lock className="w-8 h-8" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-center text-slate-800 mb-8">Yönetici Girişi</h1>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Kullanıcı Adı</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                            placeholder="Kullanıcı adınızı girin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Şifre</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
                    >
                        Giriş Yap
                    </button>
                </form>
            </div>
        </div>
    );
}
