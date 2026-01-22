'use client';

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface SliderItem {
    id: number;
    title: string;
    image_url: string;
    link?: string;
    display_order: number;
    is_active: boolean;
    description?: string;
}

interface EventsSliderProps {
    slides: SliderItem[];
}

export function EventsSlider({ slides }: EventsSliderProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    if (!slides || slides.length === 0) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
                <div className="overflow-hidden w-full h-full" ref={emblaRef}>
                    <div className="flex w-full h-full">
                        {slides.map((slide) => (
                            <div className="flex-[0_0_100%] min-w-0 relative w-full h-full" key={slide.id}>
                                {/* Background Image with Overlay */}
                                <div className="absolute inset-0">
                                    <img
                                        src={slide.image_url}
                                        alt={slide.title || 'Slider Image'}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="absolute inset-0 flex items-center justify-center text-center">
                                    <div className="container mx-auto px-4">
                                        <div className="max-w-4xl mx-auto space-y-6">
                                            {slide.title && (
                                                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow-md">
                                                    {slide.title}
                                                </h2>
                                            )}

                                            {slide.link && (
                                                <div className="pt-4">
                                                    <Link
                                                        href={slide.link}
                                                        className="inline-flex items-center px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-black hover:text-white transition-all shadow-lg hover:scale-105"
                                                    >
                                                        Detayları İncele
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-black backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden md:block"
                    onClick={scrollPrev}
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-black backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden md:block"
                    onClick={scrollNext}
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            </div>
        </div>
    );
}
