'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Layout, Image as ImageIcon, Type, Link as LinkIcon, Menu, FileText, Star, Grid, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface SiteSetting {
    key: string;
    label: string;
    value: any;
}

const DEFAULT_SETTINGS_MAP: Record<string, { label: string, value: any }> = {
    'hero_section': {
        label: 'Ana Sayfa Banner',
        value: [
            {
                mediaType: 'image',
                mediaUrl: '',
                title: "ACITY'DE HAYAT",
                subtitle: "ALIŞVERİŞİN, LEZZETİN VE EĞLENCENİN MERKEZİ"
            }
        ]
    },
    'info_section': {
        label: 'Bilgi Alanı (Info Section)',
        value: {
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
            smallTitle: "Yeniliğin Işığı",
            bigTitle: "Senin Yıldızın\nParlak!",
            description: "Acity için yıldız yalnızca bir sembol değil; aynı zamanda iyiliğe yön veren bir pusula. Acity'nin enerji verimliliğini ve çevreyi önceleyen uygulamaları da bu pusulanın bir parçası."
        }
    },
    'image_banner': {
        label: 'Resim Banner',
        value: {
            imageUrl: "https://images.unsplash.com/photo-1517604931442-71053e6e2460?w=1600&q=80",
            title: "HER ADIMDA BİRAZ DAHA PARLA!"
        }
    },
    'double_image_link': {
        label: 'İkili Görsel Link',
        value: [
            {
                title: "Lezzetin Adresi: Cafe & Restoran",
                image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
                href: "/dining"
            },
            {
                title: "Modanın Kalbi: Giyim & Aksesuar",
                image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
                href: "/stores"
            }
        ]
    },
    'story_section': {
        label: 'Hikaye Alanı',
        value: {
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
            title: "ALIŞVERİŞİN\nPARLAYAN YILDIZI",
            description: "Acity Mall, Ankara'nın alışveriş ve yaşam kültüründe değişimi izleyen ve yeniliği belirleyen bir konumda yer alıyor."
        }
    },
    'featured_brands': {
        label: 'Öne Çıkan Mağazalar',
        value: [
            { id: 1, name: "GUESS", logoUrl: "" },
            { id: 2, name: "BOSS", logoUrl: "" },
            { id: 3, name: "Calvin Klein", logoUrl: "" },
            { id: 4, name: "GAP", logoUrl: "" },
            { id: 5, name: "Columbia", logoUrl: "" },
            { id: 6, name: "SuperStep", logoUrl: "" },
            { id: 7, name: "Boyner", logoUrl: "" },
            { id: 8, name: "Marks & Spencer", logoUrl: "" },
            { id: 9, name: "Tommy Hilfiger", logoUrl: "" },
            { id: 10, name: "Mavi", logoUrl: "" },
            { id: 11, name: "Network", logoUrl: "" },
            { id: 12, name: "Beymen", logoUrl: "" }
        ]
    },
    'scrolling_text': {
        label: 'Kayan Yazı (Scrolling Text)',
        value: {
            text: "Acity Mall * Acity Mall * Acity Mall * Acity Mall * Acity Mall * "
        }
    },
    'about_us': {
        label: 'Hakkımızda Sayfası',
        value: {
            image: "https://images.unsplash.com/photo-1519567241046-7f570eee3d9f?w=1600&q=80"
        }
    },
    'home_sections': {
        label: 'Anasayfa Bölümleri (Info & Story)',
        value: [
            {
                id: 'default-info',
                type: 'info',
                image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
                smallTitle: "Yeniliğin Işığı",
                bigTitle: "Senin Yıldızın\nParlak!",
                description: "Acity için yıldız yalnızca bir sembol değil; aynı zamanda iyiliğe yön veren bir pusula. Acity'nin enerji verimliliğini ve çevreyi önceleyen uygulamaları da bu pusulanın bir parçası."
            },
            {
                id: 'default-story',
                type: 'story',
                image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
                title: "ALIŞVERİŞİN\nPARLAYAN YILDIZI",
                description: "Acity Mall, Ankara'nın alışveriş ve yaşam kültüründe değişimi izleyen ve yeniliği belirleyen bir konumda yer alıyor."
            }
        ]
    }
};

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

                // Merge with default settings to ensure all keys exist
                const dbSettings = data || [];
                const mergedSettings: SiteSetting[] = [...dbSettings];

                Object.keys(DEFAULT_SETTINGS_MAP).forEach(key => {
                    if (!mergedSettings.find(s => s.key === key)) {
                        mergedSettings.push({
                            key,
                            label: DEFAULT_SETTINGS_MAP[key].label,
                            value: DEFAULT_SETTINGS_MAP[key].value
                        });
                    }
                });

                // Sort again to keep order
                mergedSettings.sort((a, b) => a.key.localeCompare(b.key));
                setSettings(mergedSettings);

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
            const filePath = `settings-media/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('image')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
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
            // Upsert all settings
            const { error } = await supabase
                .from('site_settings')
                .upsert(settings.map(s => ({
                    key: s.key,
                    label: s.label,
                    value: s.value
                })));

            if (error) throw error;

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
                let updatedValue;

                if (Array.isArray(s.value) && typeof index === 'number') {
                    // Direct array update (Double Image Link OR Featured Brands OR Hero Section)
                    // Create a deep copy for arrays of objects
                    updatedValue = s.value.map((item: any, i: number) =>
                        i === index ? { ...item, [field]: newValue } : item
                    );
                } else if (key.startsWith('mega_menu_') && typeof index === 'number') {
                    // Mega menu specific (nested 'images' array)
                    updatedValue = { ...s.value };
                    updatedValue.images = [...updatedValue.images];
                    updatedValue.images[index] = { ...updatedValue.images[index], [field]: newValue };
                } else {
                    // Regular object update
                    const currentVal = (typeof s.value === 'object' && s.value !== null && !Array.isArray(s.value)) ? s.value : {};
                    updatedValue = { ...currentVal, [field]: newValue };
                }

                return { ...s, value: updatedValue };
            }
            return s;
        }));
    };

    if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

    const heroSetting = settings.find(s => s.key === 'hero_section');

    const imageBannerSetting = settings.find(s => s.key === 'image_banner');

    const aboutUsSetting = settings.find(s => s.key === 'about_us');
    const homeSectionsSetting = settings.find(s => s.key === 'home_sections');
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

                    {/* Hero Section */}
                    {heroSetting && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <Layout className="w-5 h-5 text-red-600" />
                                    <h2 className="font-semibold text-slate-800">{heroSetting.label} (Slider)</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        // Ensure value is an array
                                        const currentVal = Array.isArray(heroSetting.value) ? heroSetting.value : [heroSetting.value];
                                        const newValue = [...currentVal, {
                                            mediaType: 'image',
                                            mediaUrl: '',
                                            title: "Yeni Slayt",
                                            subtitle: ""
                                        }];
                                        // Update the setting with the new array
                                        setSettings(prev => prev.map(s => {
                                            if (s.key === 'hero_section') return { ...s, value: newValue };
                                            return s;
                                        }));
                                    }}
                                    className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded-full hover:bg-slate-900 transition-colors"
                                >
                                    + Slayt Ekle
                                </button>
                            </div>

                            <div className="space-y-8">
                                {(Array.isArray(heroSetting.value) ? heroSetting.value : [heroSetting.value]).map((slide: any, idx: number) => (
                                    <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative">
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <span className="bg-white px-2 py-1 text-xs font-bold rounded border border-slate-200">
                                                #{idx + 1}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const currentVal = Array.isArray(heroSetting.value) ? heroSetting.value : [heroSetting.value];
                                                    const newValue = currentVal.filter((_: any, i: number) => i !== idx);
                                                    setSettings(prev => prev.map(s => {
                                                        if (s.key === 'hero_section') return { ...s, value: newValue };
                                                        return s;
                                                    }));
                                                }}
                                                className="bg-red-100 text-red-600 hover:bg-red-200 p-1 rounded transition-colors"
                                                title="Slaytı Sil"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 pt-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Medya Tipi</label>
                                                <select
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-slate-900"
                                                    value={slide.mediaType}
                                                    onChange={(e) => updateSettingValue('hero_section', 'mediaType', e.target.value, idx)}
                                                >
                                                    <option value="video">Video</option>
                                                    <option value="image">Resim</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Medya URL</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                                                        value={slide.mediaUrl}
                                                        onChange={(e) => updateSettingValue('hero_section', 'mediaUrl', e.target.value, idx)}
                                                    />
                                                    <label className="cursor-pointer px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg flex items-center gap-2">
                                                        <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'hero_section', 'mediaUrl', idx)} />
                                                        <ImageIcon className="w-4 h-4" /> Seç
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Ana Başlık</label>
                                                    <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900" value={slide.title} onChange={(e) => updateSettingValue('hero_section', 'title', e.target.value, idx)} />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Alt Başlık</label>
                                                    <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900" value={slide.subtitle} onChange={(e) => updateSettingValue('hero_section', 'subtitle', e.target.value, idx)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}



                    {/* Image Banner */}
                    {imageBannerSetting && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                                <ImageLinkIcon className="w-5 h-5 text-red-600" />
                                <h2 className="font-semibold text-slate-800">{imageBannerSetting.label}</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Banner Başlığı</label>
                                    <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900" value={imageBannerSetting.value.title} onChange={(e) => updateSettingValue('image_banner', 'title', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Banner Görseli</label>
                                    <div className="flex gap-2">
                                        <input type="text" className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900" value={imageBannerSetting.value.imageUrl} onChange={(e) => updateSettingValue('image_banner', 'imageUrl', e.target.value)} />
                                        <label className="cursor-pointer px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg flex items-center gap-2">
                                            <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'image_banner', 'imageUrl')} />
                                            <ImageIcon className="w-4 h-4" /> Seç
                                        </label>
                                    </div>
                                    {imageBannerSetting.value.imageUrl && (
                                        <div className="mt-2 h-32 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                            <img src={imageBannerSetting.value.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}




                    {/* Home Sections Settings */}
                    {homeSectionsSetting && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <Layout className="w-5 h-5 text-red-600" />
                                    <h2 className="font-semibold text-slate-800">{homeSectionsSetting.label}</h2>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newValue = [...(Array.isArray(homeSectionsSetting.value) ? homeSectionsSetting.value : []), {
                                                id: `sec-${Date.now()}`,
                                                type: 'info',
                                                image: '',
                                                smallTitle: 'Yeni Bilgi',
                                                bigTitle: 'BAŞLIK',
                                                description: ''
                                            }];
                                            setSettings(prev => prev.map(s => {
                                                if (s.key === 'home_sections') return { ...s, value: newValue };
                                                return s;
                                            }));
                                        }}
                                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 transition-colors flex items-center gap-1"
                                    >
                                        + Bilgi Alanı
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newValue = [...(Array.isArray(homeSectionsSetting.value) ? homeSectionsSetting.value : []), {
                                                id: `sec-${Date.now()}`,
                                                type: 'story',
                                                image: '',
                                                title: 'HİKAYE BAŞLIĞI',
                                                description: ''
                                            }];
                                            setSettings(prev => prev.map(s => {
                                                if (s.key === 'home_sections') return { ...s, value: newValue };
                                                return s;
                                            }));
                                        }}
                                        className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded-full hover:bg-slate-900 transition-colors flex items-center gap-1"
                                    >
                                        + Hikaye Alanı
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {(Array.isArray(homeSectionsSetting.value) ? homeSectionsSetting.value : []).map((section: any, idx: number) => (
                                    <div key={idx} className="bg-slate-50 p-6 rounded-lg border border-slate-200 relative group">
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <div className="flex flex-col gap-1 mr-2">
                                                <button
                                                    type="button"
                                                    disabled={idx === 0}
                                                    onClick={() => {
                                                        const newValue = [...(homeSectionsSetting.value as any[])];
                                                        [newValue[idx - 1], newValue[idx]] = [newValue[idx], newValue[idx - 1]];
                                                        setSettings(prev => prev.map(s => {
                                                            if (s.key === 'home_sections') return { ...s, value: newValue };
                                                            return s;
                                                        }));
                                                    }}
                                                    className="p-1 bg-white hover:bg-slate-100 rounded border border-slate-400 text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title="Yukarı Taşı"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={idx === (homeSectionsSetting.value as any[]).length - 1}
                                                    onClick={() => {
                                                        const newValue = [...(homeSectionsSetting.value as any[])];
                                                        [newValue[idx + 1], newValue[idx]] = [newValue[idx], newValue[idx + 1]];
                                                        setSettings(prev => prev.map(s => {
                                                            if (s.key === 'home_sections') return { ...s, value: newValue };
                                                            return s;
                                                        }));
                                                    }}
                                                    className="p-1 bg-white hover:bg-slate-100 rounded border border-slate-400 text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title="Aşağı Taşı"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                                </button>
                                            </div>
                                            <span className="bg-white px-2 py-1 text-xs font-bold rounded border border-slate-400 text-slate-900 h-fit">
                                                {section.type === 'info' ? 'Bilgi Alanı' : 'Hikaye Alanı'} #{idx + 1}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newValue = (homeSectionsSetting.value as any[]).filter((_, i) => i !== idx);
                                                    setSettings(prev => prev.map(s => {
                                                        if (s.key === 'home_sections') return { ...s, value: newValue };
                                                        return s;
                                                    }));
                                                }}
                                                className="bg-red-100 text-red-600 hover:bg-red-200 p-1 rounded transition-colors h-fit"
                                                title="Bölümü Sil"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                            {section.type === 'info' ? (
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">Küçük Başlık</label>
                                                        <input
                                                            type="text"
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                                            value={section.smallTitle}
                                                            onChange={(e) => updateSettingValue('home_sections', 'smallTitle', e.target.value, idx)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">Büyük Başlık</label>
                                                        <textarea
                                                            rows={2}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                                            value={section.bigTitle}
                                                            onChange={(e) => updateSettingValue('home_sections', 'bigTitle', e.target.value, idx)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
                                                        <textarea
                                                            rows={4}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                                            value={section.description}
                                                            onChange={(e) => updateSettingValue('home_sections', 'description', e.target.value, idx)}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">Başlık</label>
                                                        <textarea
                                                            rows={2}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                                            value={section.title}
                                                            onChange={(e) => updateSettingValue('home_sections', 'title', e.target.value, idx)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
                                                        <textarea
                                                            rows={4}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                                                            value={section.description}
                                                            onChange={(e) => updateSettingValue('home_sections', 'description', e.target.value, idx)}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-4">
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Görsel</label>
                                                <div className="aspect-[4/3] bg-white rounded-lg overflow-hidden border border-slate-200 relative">
                                                    {section.image ? (
                                                        <img src={section.image} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Görsel Yok</div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                                                        value={section.image}
                                                        onChange={(e) => updateSettingValue('home_sections', 'image', e.target.value, idx)}
                                                        placeholder="https://..."
                                                    />
                                                    <label className="cursor-pointer px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg flex items-center gap-2">
                                                        <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'home_sections', 'image', idx)} />
                                                        <ImageIcon className="w-4 h-4" />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* About Us Settings */
                    }
                    {aboutUsSetting && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                                <FileText className="w-5 h-5 text-red-600" />
                                <h2 className="font-semibold text-slate-800">{aboutUsSetting.label}</h2>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Kapak Görseli</label>
                                <div className="space-y-2">
                                    <div className="h-48 bg-slate-100 rounded-lg overflow-hidden relative border border-slate-200">
                                        <img src={aboutUsSetting.value.image} alt="About Hero" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex gap-2">
                                        <input type="text" className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900" value={aboutUsSetting.value?.image || ''} onChange={(e) => updateSettingValue('about_us', 'image', e.target.value)} />
                                        <label className="cursor-pointer px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg flex items-center gap-2">
                                            <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'about_us', 'image')} />
                                            <ImageIcon className="w-4 h-4" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}



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

// Helper icon component
function ImageLinkIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
    )
}
