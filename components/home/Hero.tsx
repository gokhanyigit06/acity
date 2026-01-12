'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export interface HeroSettings {
    mediaType: 'image' | 'video';
    mediaUrl: string;
    title: string;
    subtitle: string;
}

const DEFAULT_SETTINGS: HeroSettings = {
    mediaType: 'image',
    mediaUrl: '',
    title: "ACITY'DE HAYAT",
    subtitle: "ALIŞVERİŞİN, LEZZETİN VE EĞLENCENİN MERKEZİ"
};

interface HeroProps {
    initialData?: HeroSettings | null;
}

export function Hero({ initialData }: HeroProps) {
    const [settings, setSettings] = useState<HeroSettings | null>(initialData || null);
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
        // If we already have data from the server, we don't strictly need to fetch again immediately.
        // But if you want to ensure client-side freshness or if initialData was null for some reason:
        if (initialData) {
            setLoading(false);
            return;
        }

        const fetchSettings = async () => {
            try {
                const { data, error } = await supabase
                    .from('site_settings')
                    .select('value')
                    .eq('key', 'hero_section')
                    .single();

                if (data) {
                    setSettings(data.value);
                }
            } catch (error) {
                console.error('Error fetching hero settings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [initialData]);

    const heroData = settings || DEFAULT_SETTINGS;

    return (
        <section className="bg-white py-4">
            <div className="container mx-auto px-4">
                <div className="relative w-full aspect-video md:aspect-auto md:h-[80vh] overflow-hidden bg-black rounded-lg shadow-sm">
                    {/* Background Media */}
                    <div className="absolute inset-0 z-0">
                        {heroData.mediaType === 'video' && heroData.mediaUrl ? (
                            <video
                                src={heroData.mediaUrl}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : heroData.mediaType === 'image' && heroData.mediaUrl ? (
                            <div className="relative w-full h-full">
                                <Image
                                    src={heroData.mediaUrl}
                                    alt={heroData.title}
                                    fill
                                    className="object-cover"
                                    priority // Prioritize loading the hero image
                                />
                            </div>
                        ) : (
                            <div className="absolute inset-0 bg-neutral-900" />
                        )}

                        <div className="absolute inset-0 bg-black/30" /> {/* Overlay for text readability */}
                    </div>

                    {/* Content Container */}
                    <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
                        <div className="max-w-4xl space-y-6">
                            <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tight uppercase drop-shadow-lg">
                                {heroData.title}
                            </h1>
                            {heroData.subtitle && (
                                <p className="text-white/90 text-lg md:text-2xl font-light drop-shadow-md">
                                    {heroData.subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
