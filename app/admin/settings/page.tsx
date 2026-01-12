'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Layout, Image as ImageIcon, Type, Link as LinkIcon, Menu } from 'lucide-react';
import Link from 'next/link';

interface SiteSetting {
    key: string;
    label: string;
    value: any;
}

export default function SiteSettingsPage() {
    const [settings, setSettings] = useState<SiteSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            router.push('/admin');
            return;
        }

        const fetchSettings = async () => {
            try {
                const { data, error } = await supabase
                    .from('site_settings')
                    .select('*')
                    .order('key');

                if (error) throw error;
                setSettings(data || []);
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [router]);

    const handleFileUpload = async (file: File, settingKey: string, field: string, index?: number) => {
        setUploading(true);
        setMessage(null);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `site-media/${fileName}`;

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('image')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('image')
                .getPublicUrl(filePath);

            // Update setting value
            updateSettingValue(settingKey, field, publicUrl, index);

            setMessage({ type: 'success', text: 'Dosya başarıyla yüklendi!' });
        } catch (error: any) {
            console.error('Error uploading file:', error);
            setMessage({ type: 'error', text: error.message || 'Dosya yüklenirken hata oluştu.' });
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            // Update all settings
            for (const setting of settings) {
                const { error } = await supabase
                    .from('site_settings')
                    .update({ value: setting.value })
                    .eq('key', setting.key);

                if (error) throw error;
            }

            setMessage({ type: 'success', text: 'Ayarlar başarıyla kaydedildi!' });
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({ type: 'error', text: 'Kaydederken bir sorun oluştu.' });
        } finally {
            setSaving(false);
        }
    };

    const updateSettingValue = (key: string, field: string, newValue: any, index?: number) => {
        setSettings(prev => prev.map(s => {
            if (s.key === key) {
                // Determine if we are updating a nested array item or a direct property
                let updatedValue = { ...s.value };

                if (typeof index === 'number' && Array.isArray(updatedValue.images)) {
                    // Specifically handling the 'images' array inside value
                    updatedValue.images = [...updatedValue.images];
                    updatedValue.images[index] = { ...updatedValue.images[index], [field]: newValue };
                } else {
                    updatedValue[field] = newValue;
                }
                return { ...s, value: updatedValue };
            }
            return s;
        }));
    };

    if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

    const heroSetting = settings.find(s => s.key === 'hero_section');
    const megaMenuSettings = settings.filter(s => s.key.startsWith('mega_menu_'));

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
                            <h1 className="text-xl font-bold text-slate-900">Site Ayarları</h1>
                            <p className="text-xs text-slate-500">Görünüm ve içerik düzenlemeleri</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto max-w-4xl px-6 py-8">
                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center justify-center font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-8">

                    {/* Hero Section Settings */}
                    {heroSetting && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                                <Layout className="w-5 h-5 text-red-600" />
                                <h2 className="font-semibold text-slate-800">Ana Sayfa Banner (Hero)</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Medya Tipi</label>
                                    <select
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white"
                                        value={heroSetting.value.mediaType}
                                        onChange={(e) => updateSettingValue('hero_section', 'mediaType', e.target.value)}
                                    >
                                        <option value="video">Video</option>
                                        <option value="image">Resim</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Medya URL (Video mp4 veya Resim jpg/png)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
                                            value={heroSetting.value.mediaUrl}
                                            onChange={(e) => updateSettingValue('hero_section', 'mediaUrl', e.target.value)}
                                            placeholder="https://..."
                                        />
                                        <label className="relative cursor-pointer">
                                            <input
                                                type="file"
                                                accept={heroSetting.value.mediaType === 'video' ? 'video/*' : 'image/*'}
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleFileUpload(file, 'hero_section', 'mediaUrl');
                                                }}
                                                disabled={uploading}
                                            />
                                            <div className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50">
                                                <ImageIcon className="w-4 h-4" />
                                                {uploading ? 'Yükleniyor...' : 'Dosya Seç'}
                                            </div>
                                        </label>
                                    </div>
                                    {heroSetting.value.mediaUrl && (
                                        <div className="mt-2 p-2 bg-slate-50 rounded border border-slate-200">
                                            <p className="text-xs text-slate-600 break-all">{heroSetting.value.mediaUrl}</p>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Ana Başlık</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none font-bold"
                                        value={heroSetting.value.title}
                                        onChange={(e) => updateSettingValue('hero_section', 'title', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Alt Başlık</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                        value={heroSetting.value.subtitle}
                                        onChange={(e) => updateSettingValue('hero_section', 'subtitle', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mega Menu Settings */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2 px-1">
                            <Menu className="w-5 h-5 text-slate-600" />
                            <h2 className="text-xl font-bold text-slate-800">Mega Menü Görselleri</h2>
                        </div>

                        {megaMenuSettings.map(setting => (
                            <div key={setting.key} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    {setting.label} ({setting.value.title})
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {(setting.value.images as any[]).map((img, index) => (
                                        <div key={index} className="space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <div className="aspect-[3/2] relative bg-white rounded overflow-hidden border border-slate-200 flex items-center justify-center">
                                                {img.src ? (
                                                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xs text-slate-400">Görsel Yok</span>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 mb-1">Görsel URL</label>
                                                <div className="flex gap-1">
                                                    <input
                                                        type="text"
                                                        className="flex-1 px-2 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-500 outline-none"
                                                        value={img.src}
                                                        onChange={(e) => updateSettingValue(setting.key, 'src', e.target.value, index)}
                                                        placeholder="https://..."
                                                    />
                                                    <label className="relative cursor-pointer">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) handleFileUpload(file, setting.key, 'src', index);
                                                            }}
                                                            disabled={uploading}
                                                        />
                                                        <div className="px-2 py-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded text-xs transition-colors">
                                                            📁
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 mb-1">Alt Metin</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-500 outline-none"
                                                    value={img.alt}
                                                    onChange={(e) => updateSettingValue(setting.key, 'alt', e.target.value, index)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end pt-4 sticky bottom-6 z-10">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'Kaydediliyor...' : 'Tüm Ayarları Kaydet'}
                        </button>
                    </div>

                </form>
            </main>
        </div>
    );
}
