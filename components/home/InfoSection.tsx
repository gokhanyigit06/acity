'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export interface InfoSectionSettings {
    image: string;
    smallTitle: string;
    bigTitle: string;
    description: string;
}

const DEFAULT_SETTINGS: InfoSectionSettings = {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    smallTitle: "Yeniliğin Işığı",
    bigTitle: "Senin Yıldızın\nParlak!",
    description: "Acity için yıldız yalnızca bir sembol değil; aynı zamanda iyiliğe yön veren bir pusula. Acity'nin enerji verimliliğini ve çevreyi önceleyen uygulamaları da bu pusulanın bir parçası."
};

interface InfoSectionProps {
    initialData?: InfoSectionSettings | null;
}

export function InfoSection({ initialData }: InfoSectionProps) {
    const [settings, setSettings] = useState<InfoSectionSettings | null>(initialData || null);

    useEffect(() => {
        if (initialData) return;

        const fetchSettings = async () => {
            try {
                const { data } = await supabase
                    .from('site_settings')
                    .select('value')
                    .eq('key', 'info_section')
                    .single();

                if (data) setSettings(data.value);
            } catch (error) {
                console.error('Error fetching info section:', error);
            }
        };

        fetchSettings();
    }, [initialData]);

    const data = settings || DEFAULT_SETTINGS;

    return (
        <section className="py-6 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                    {/* Left Side - Image */}
                    <div className="w-full md:w-1/2 relative aspect-[4/3] md:aspect-video lg:aspect-[16/9] max-h-[400px]">
                        <div className="relative w-full h-full overflow-hidden shadow-xl rounded-lg">
                            {/* Standard img tag for debugging/reliability */}
                            <img
                                src={data.image}
                                alt={data.smallTitle}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="w-full md:w-1/2 text-center flex flex-col items-center justify-center space-y-6">
                        <h3 className="text-xl font-bold text-slate-900 tracking-wide">
                            {data.smallTitle}
                        </h3>

                        <h2 className="text-4xl md:text-5xl font-light text-slate-900 leading-tight uppercase tracking-wider whitespace-pre-line">
                            {data.bigTitle}
                        </h2>

                        <div className="w-24 h-px bg-slate-300 my-2" />

                        <p className="text-slate-600 text-lg leading-relaxed max-w-lg mx-auto">
                            {data.description}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
