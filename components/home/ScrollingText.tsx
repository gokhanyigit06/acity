'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ScrollingTextSettings {
    text: string;
}

const DEFAULT_SETTINGS: ScrollingTextSettings = {
    text: "Acity Mall *  Acity Mall * Acity Mall * Acity Mall * Acity Mall *"
};

interface ScrollingTextProps {
    initialData?: ScrollingTextSettings | null;
}

export function ScrollingText({ initialData }: ScrollingTextProps) {
    const [settings, setSettings] = useState<ScrollingTextSettings | null>(initialData || null);

    useEffect(() => {
        if (initialData) return;

        const fetchSettings = async () => {
            try {
                const { data } = await supabase
                    .from('site_settings')
                    .select('value')
                    .eq('key', 'scrolling_text')
                    .single();

                if (data?.value) {
                    setSettings(data.value);
                }
            } catch (error) {
                console.error('Error fetching scrolling text:', error);
            }
        };

        fetchSettings();
    }, [initialData]);

    const data = settings || DEFAULT_SETTINGS;

    // Repeat the text enough times to fill the screen and then some for the loop
    const repeatedText = Array(20).fill(data.text).join("  ");

    return (
        <section className="relative w-full h-48 bg-white overflow-hidden py-10 my-10">
            {/* First diagonal strip - Tilted down */}
            <div className="absolute top-1/2 left-0 w-[120%] -translate-y-1/2 -translate-x-[10%] rotate-3 bg-black py-4 z-10 shadow-xl border-y border-white/20">
                <div className="animate-marquee whitespace-nowrap">
                    <span className="text-white font-bold text-2xl uppercase tracking-widest mx-4">
                        {repeatedText}
                    </span>
                    <span className="text-white font-bold text-2xl uppercase tracking-widest mx-4">
                        {repeatedText}
                    </span>
                </div>
            </div>

            {/* Second diagonal strip - Tilted up */}
            <div className="absolute top-1/2 left-0 w-[120%] -translate-y-1/2 -translate-x-[10%] -rotate-2 bg-black py-4 z-0 opacity-90">
                <div className="animate-marquee-reverse whitespace-nowrap">
                    <span className="text-white font-bold text-2xl uppercase tracking-widest mx-4">
                        {repeatedText}
                    </span>
                    <span className="text-white font-bold text-2xl uppercase tracking-widest mx-4">
                        {repeatedText}
                    </span>
                </div>
            </div>
        </section>
    );
}
