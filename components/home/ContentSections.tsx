'use client';

import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export interface SectionData {
    id: string;
    layout: 'image-left' | 'image-right';
    smallTitle?: string;
    title: string;
    description: string;
    image: string;
}

interface ContentSectionsProps {
    sections?: SectionData[];
}

export function ContentSections({ sections }: ContentSectionsProps) {
    if (!sections || sections.length === 0) return null;

    return (
        <div className="flex flex-col gap-0">
            {sections.map((section, index) => (
                <section key={section.id || index} className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <div className={cn(
                            "flex flex-col items-center gap-8 md:gap-16",
                            section.layout === 'image-left' ? "md:flex-row" : "md:flex-row-reverse"
                        )}>
                            {/* Image Side */}
                            <div className="w-full md:w-1/2 relative aspect-[4/3] md:aspect-video lg:aspect-[16/9] max-h-[500px]">
                                <div className="relative w-full h-full overflow-hidden shadow-xl rounded-lg">
                                    <img
                                        src={section.image}
                                        alt={section.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="w-full md:w-1/2 text-center flex flex-col items-center justify-center space-y-6">
                                {section.smallTitle && (
                                    <h3 className="text-xl font-bold text-slate-900 tracking-wide">
                                        {section.smallTitle}
                                    </h3>
                                )}

                                <h2 className="text-3xl md:text-5xl font-light text-slate-900 leading-tight uppercase tracking-wider whitespace-pre-line">
                                    {section.title}
                                </h2>

                                <div className="w-24 h-px bg-slate-300 my-2" />

                                <p className="text-slate-600 text-lg leading-relaxed max-w-lg mx-auto whitespace-pre-line">
                                    {section.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            ))}
        </div>
    );
}
