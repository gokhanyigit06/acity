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
            const filePath = `site-media/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
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
                    updatedValue = { ...s.value, [field]: newValue };
                }

                return { ...s, value: updatedValue };
            }
            return s;
        }));
    };

    if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

    const heroSetting = settings.find(s => s.key === 'hero_section');
    const infoSetting = settings.find(s => s.key === 'info_section');
    const imageBannerSetting = settings.find(s => s.key === 'image_banner');
    const doubleLinkSetting = settings.find(s => s.key === 'double_image_link');
    const storySetting = settings.find(s => s.key === 'story_section');
    const featuredBrandsSetting = settings.find(s => s.key === 'featured_brands');
    const scrollingTextSetting = settings.find(s => s.key === 'scrolling_text');
    const aboutUsSetting = settings.find(s => s.key === 'about_us');
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
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
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
                                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
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
                                                    <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg" value={slide.title} onChange={(e) => updateSettingValue('hero_section', 'title', e.target.value, idx)} />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Alt Başlık</label>
                                                    <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg" value={slide.subtitle} onChange={(e) => updateSettingValue('hero_section', 'subtitle', e.target.value, idx)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Info Section */}
                    {infoSetting && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                                <FileText className="w-5 h-5 text-red-600" />
                                <h2 className="font-semibold text-slate-800">{infoSetting.label}</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Küçük Başlık</label>
                                        <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg" value={infoSetting.value.smallTitle} onChange={(e) => updateSettingValue('info_section', 'smallTitle', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Büyük Başlık (Alt satır için Enter kullanın)</label>
                                        <textarea rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg" value={infoSetting.value.bigTitle} onChange={(e) => updateSettingValue('info_section', 'bigTitle', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
                                        <textarea rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-lg" value={infoSetting.value.description} onChange={(e) => updateSettingValue('info_section', 'description', e.target.value)} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Görsel</label>
                                    <div className="space-y-2">
                                        <div className="aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden relative border border-slate-200">
                                            <img src={infoSetting.value.image} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex gap-2">
                                            <input type="text" className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs" value={infoSetting.value.image} onChange={(e) => updateSettingValue('info_section', 'image', e.target.value)} />
                                            <label className="cursor-pointer px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg flex items-center gap-2">
                                                <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'info_section', 'image')} />
                                                <ImageIcon className="w-4 h-4" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
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
                                    <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg" value={imageBannerSetting.value.title} onChange={(e) => updateSettingValue('image_banner', 'title', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Banner Görseli</label>
                                    <div className="flex gap-2">
                                        <input type="text" className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm" value={imageBannerSetting.value.imageUrl} onChange={(e) => updateSettingValue('image_banner', 'imageUrl', e.target.value)} />
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

                    {/* Double Image Link */}
                    {doubleLinkSetting && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                                <Grid className="w-5 h-5 text-red-600" />
                                <h2 className="font-semibold text-slate-800">{doubleLinkSetting.label}</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {(doubleLinkSetting.value as any[]).map((item, idx) => (
                                    <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                                        <h3 className="font-medium text-slate-700">Kart {idx + 1}</h3>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 mb-1">Başlık</label>
                                            <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" value={item.title} onChange={(e) => updateSettingValue('double_image_link', 'title', e.target.value, idx)} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 mb-1">Link (Href)</label>
                                            <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" value={item.href} onChange={(e) => updateSettingValue('double_image_link', 'href', e.target.value, idx)} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 mb-1">Görsel</label>
                                            <div className="relative aspect-square bg-white rounded border border-slate-200 mb-2 overflow-hidden">
                                                <img src={item.image} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex gap-2">
                                                <input type="text" className="flex-1 px-2 py-1 border border-slate-300 rounded text-xs" value={item.image} onChange={(e) => updateSettingValue('double_image_link', 'image', e.target.value, idx)} />
                                                <label className="cursor-pointer px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded text-xs flex items-center gap-1">
                                                    <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'double_image_link', 'image', idx)} />
                                                    <ImageIcon className="w-3 h-3" />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Story Section */}
                    {storySetting && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                                <Star className="w-5 h-5 text-red-600" />
                                <h2 className="font-semibold text-slate-800">{storySetting.label}</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Başlık</label>
                                        <textarea rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg" value={storySetting.value.title} onChange={(e) => updateSettingValue('story_section', 'title', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
                                        <textarea rows={5} className="w-full px-3 py-2 border border-slate-300 rounded-lg" value={storySetting.value.description} onChange={(e) => updateSettingValue('story_section', 'description', e.target.value)} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Görsel</label>
                                    <div className="space-y-2">
                                        <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden relative border border-slate-200">
                                            <img src={storySetting.value.image} alt="Story" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex gap-2">
                                            <input type="text" className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs" value={storySetting.value.image} onChange={(e) => updateSettingValue('story_section', 'image', e.target.value)} />
                                            <label className="cursor-pointer px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg flex items-center gap-2">
                                                <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'story_section', 'image')} />
                                                <ImageIcon className="w-4 h-4" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Featured Brands Settings */}
                    {featuredBrandsSetting && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-red-600" />
                                    <h2 className="font-semibold text-slate-800">{featuredBrandsSetting.label}</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newValue = [...(featuredBrandsSetting?.value as any[] || []), {
                                            id: Date.now(),
                                            name: 'Yeni Marka',
                                            logoUrl: ''
                                        }];
                                        updateSettingValue('featured_brands', 'value', newValue); // Special case handling required or strict strict update
                                        // Since updateSettingValue handles field update for array items, we need a way to update the WHOLE array value for add/remove.
                                        // Let's modify setSettings directly for this special case as a quick fix, or better, make updateSettingValue smarter.
                                        // For now, direct setSettings is easiest for add/remove
                                        setSettings(prev => prev.map(s => {
                                            if (s.key === 'featured_brands') return { ...s, value: newValue };
                                            return s;
                                        }));
                                    }}
                                    className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded-full hover:bg-slate-900 transition-colors"
                                >
                                    + Marka Ekle
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {(featuredBrandsSetting?.value as any[] || []).map((brand, idx) => (
                                    <div key={idx} className="relative p-3 bg-slate-50 rounded-lg border border-slate-200 group">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newValue = (featuredBrandsSetting?.value as any[] || []).filter((_, i) => i !== idx);
                                                setSettings(prev => prev.map(s => {
                                                    if (s.key === 'featured_brands') return { ...s, value: newValue };
                                                    return s;
                                                }));
                                            }}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                                            title="Sil"
                                        >
                                            ×
                                        </button>

                                        <div className="aspect-[4/3] bg-white rounded border border-slate-100 mb-2 flex items-center justify-center overflow-hidden">
                                            {brand?.logoUrl ? (
                                                <img src={brand?.logoUrl} alt={brand?.name} className="max-w-full max-h-full p-2 object-contain" />
                                            ) : (
                                                <span className="text-xs font-bold text-slate-400">{brand?.name}</span>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <div>
                                                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Marka Adı</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                                                    value={brand?.name}
                                                    onChange={(e) => updateSettingValue('featured_brands', 'name', e.target.value, idx)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Logo</label>
                                                <div className="flex gap-1">
                                                    <label className="flex-1 cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-600 rounded text-[10px] py-1 flex items-center justify-center gap-1 transition-colors">
                                                        <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'featured_brands', 'logoUrl', idx)} />
                                                        <ImageIcon className="w-3 h-3" /> Yükle
                                                    </label>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="w-full mt-1 px-2 py-1 border border-slate-300 rounded text-[10px] text-slate-400"
                                                    placeholder="URL..."
                                                    value={brand?.logoUrl || ''}
                                                    onChange={(e) => updateSettingValue('featured_brands', 'logoUrl', e.target.value, idx)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Scrolling Text Settings */}
                    {scrollingTextSetting && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                                <Type className="w-5 h-5 text-red-600" />
                                <h2 className="font-semibold text-slate-800">{scrollingTextSetting.label}</h2>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Kayan Yazı Metni</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                        value={scrollingTextSetting?.value.text}
                                        onChange={(e) => updateSettingValue('scrolling_text', 'text', e.target.value)}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Yazının tekrarlanarak kayması için kısa ve öz bir metin giriniz. Ayırıcı olarak * veya - kullanabilirsiniz.</p>
                            </div>
                        </div>
                    )}

                    {/* About Us Settings */}
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
                                        <input type="text" className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs" value={aboutUsSetting.value.image} onChange={(e) => updateSettingValue('about_us', 'image', e.target.value)} />
                                        <label className="cursor-pointer px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg flex items-center gap-2">
                                            <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'about_us', 'image')} />
                                            <ImageIcon className="w-4 h-4" />
                                        </label>
                                    </div>
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
                                    {setting.label} ({setting.value?.title || 'Başlık Yok'})
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {(setting.value?.images as any[] || []).map((img, index) => (
                                        <div key={index} className="space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <div className="aspect-[3/2] relative bg-white rounded overflow-hidden border border-slate-200 flex items-center justify-center">
                                                {img?.src ? (
                                                    <img src={img?.src} alt={img?.alt} className="w-full h-full object-cover" />
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
                                                        value={img?.src || ''}
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
