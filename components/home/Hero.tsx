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
    const [settings, setSettings] = useState<HeroSettings | HeroSettings[] | null>(initialData || null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
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

    const slides = Array.isArray(settings) ? settings : (settings ? [settings] : [DEFAULT_SETTINGS]);

    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const activeSlide = slides[currentSlide];

    return (
        <section className="bg-white py-4">
            <div className="container mx-auto px-4">
                <div className="relative w-full aspect-video md:aspect-auto md:h-[80vh] overflow-hidden bg-black rounded-lg shadow-sm group">

                    {/* Background Media */}
                    <div className="absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out">
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                            >
                                {slide.mediaType === 'video' && slide.mediaUrl ? (
                                    <video
                                        src={slide.mediaUrl}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                ) : slide.mediaType === 'image' && slide.mediaUrl ? (
                                    <img
                                        src={slide.mediaUrl}
                                        alt={slide.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-neutral-900" />
                                )}
                                <div className="absolute inset-0 bg-black/30" />
                            </div>
                        ))}
                    </div>

                    {/* Content Container */}
                    <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
                        <div className="max-w-4xl space-y-6">
                            <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tight uppercase drop-shadow-lg transition-all duration-700 transform translate-y-0 opacity-100">
                                {activeSlide.title}
                            </h1>
                            {activeSlide.subtitle && (
                                <p className="text-white/90 text-lg md:text-2xl font-light drop-shadow-md">
                                    {activeSlide.subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    {slides.length > 1 && (
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Navigation Arrows */}
                    {slides.length > 1 && (
                        <>
                            <button
                                onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100 z-20"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            </button>
                            <button
                                onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100 z-20"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </button>
                        </>
                    )}

                </div>
            </div>
        </section>
    );
}
