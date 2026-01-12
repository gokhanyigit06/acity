'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export interface ImageBannerSettings {
    imageUrl: string;
    title: string;
}

const DEFAULT_SETTINGS: ImageBannerSettings = {
    imageUrl: "https://images.unsplash.com/photo-1517604931442-71053e6e2460?w=1600&q=80",
    title: "HER ADIMDA BİRAZ DAHA PARLA!"
};

interface ImageBannerProps {
    initialData?: ImageBannerSettings | null;
}

export function ImageBanner({ initialData }: ImageBannerProps) {
    const [settings, setSettings] = useState<ImageBannerSettings | null>(initialData || null);

    useEffect(() => {
        if (initialData) return;

        const fetchSettings = async () => {
            try {
                const { data } = await supabase
                    .from('site_settings')
                    .select('value')
                    .eq('key', 'image_banner')
                    .single();

                if (data) setSettings(data.value);
            } catch (error) {
                console.error('Error fetching image banner:', error);
            }
        };

        fetchSettings();
    }, [initialData]);

    const data = settings || DEFAULT_SETTINGS;

    return (
        <section className="py-6 bg-white">
            <div className="container mx-auto px-4">
                <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={data.imageUrl}
                            alt="Banner Background"
                            fill
                            className="object-cover"
                        />
                        {/* Overlay for text readability - slightly darker to match the "shine" contrast */}
                        <div className="absolute inset-0 bg-black/40" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-6xl font-semibold text-white tracking-widest uppercase leading-tight drop-shadow-lg">
                            {data.title}
                        </h2>
                        {/* Optional decorative elements matching the 'stars' in the screenshot could be added here later */}
                    </div>
                </div>
            </div>
        </section>
    );
}
