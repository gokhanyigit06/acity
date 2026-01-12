'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

import { useLanguage } from '@/context/LanguageContext';

export interface StorySectionSettings {
    image: string;
    title: string;
    description: string;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80";

interface StorySectionProps {
    initialData?: StorySectionSettings | null;
}

export function StorySection({ initialData }: StorySectionProps) {
    const { t } = useLanguage();
    const [settings, setSettings] = useState<StorySectionSettings | null>(initialData || null);

    useEffect(() => {
        if (initialData) return;

        const fetchSettings = async () => {
            try {
                const { data } = await supabase
                    .from('site_settings')
                    .select('value')
                    .eq('key', 'story_section')
                    .single();

                if (data) setSettings(data.value);
            } catch (error) {
                console.error('Error fetching story section:', error);
            }
        };

        fetchSettings();
    }, [initialData]);

    // Use settings if available, otherwise use translations
    // Note: If settings are present (from DB), they will override translations.
    // This allows admin to customize text, but might break multi-language if DB only stores one language.
    const displayData = {
        image: settings?.image || DEFAULT_IMAGE,
        title: settings?.title || t('home.story_title'),
        description: settings?.description || t('home.story_description')
    };

    return (
        <section className="py-4 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    {/* Left Side - Content */}
                    <div className="w-full text-center flex flex-col items-center justify-center space-y-4 order-2 md:order-1">
                        <h2 className="text-3xl md:text-4xl font-light text-slate-900 leading-tight uppercase tracking-wider whitespace-pre-line">
                            {displayData.title}
                        </h2>

                        <p className="text-slate-600 text-base leading-relaxed max-w-lg mx-auto">
                            {displayData.description}
                        </p>
                    </div>

                    {/* Right Side - Image */}
                    <div className="relative aspect-square w-full order-1 md:order-2 max-h-[500px]">
                        <div className="relative w-full h-full overflow-hidden">
                            {/* Standard img tag for debugging/reliability */}
                            <img
                                src={displayData.image}
                                alt={t('home.story_alt')}
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
