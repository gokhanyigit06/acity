'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

import { EventsSlider } from "@/components/events/EventsSlider";

interface Event {
    id: number;
    type: string;
    title: string;
    date_text: string;
    time_text: string;
    location: string;
    image_url: string;
    description: string;
    slug: string;
}

interface SliderItem {
    id: number;
    title: string;
    image_url: string;
    link?: string;
    display_order: number;
    is_active: boolean;
    description?: string;
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Events
                const { data: eventsData, error: eventsError } = await supabase
                    .from('events')
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false });

                if (eventsError) throw eventsError;
                if (eventsData) setEvents(eventsData);

                // Fetch Slider Items
                // Note: We use a separate try-catch or safe fetch for slider since table might be new
                try {
                    const { data: sliderData, error: sliderError } = await supabase
                        .from('event_slider')
                        .select('*')
                        .eq('is_active', true)
                        .order('display_order', { ascending: true });

                    if (!sliderError && sliderData) {
                        setSliderItems(sliderData);
                    }
                } catch (sliderErr) {
                    console.warn("Slider fetch failed:", sliderErr);
                }

            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <main className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            {/* Slider Section */}
            {!loading && sliderItems.length > 0 ? (
                <EventsSlider slides={sliderItems} />
            ) : (
                /* Fallback Header if no slider items */
                <div className="bg-slate-900 text-white py-16 md:py-24">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">Etkinlikler & Kampanyalar</h1>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Acity'de gerçekleşen tüm etkinlikler, konserler, atölyeler ve kaçırılmayacak kampanya fırsatları burada.
                        </p>
                    </div>
                </div>
            )}

            {/* List Title - Only show if slider is present to separate sections */}
            {!loading && sliderItems.length > 0 && (
                <div className="container mx-auto px-4 pt-8 text-center">
                    <h2 className="text-3xl font-bold text-slate-900">Tüm Etkinlikler</h2>
                </div>
            )}

            {/* List */}
            <div className="container mx-auto px-4 py-8 pb-16">
                {loading ? (
                    <div className="text-center py-20">Yükleniyor...</div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">Henüz aktif etkinlik bulunmuyor.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((item) => (
                            <Link href={`/etkinlikler/${item.slug}`} key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-slate-100 block hover:-translate-y-1">
                                {/* Image */}
                                <div className="aspect-[16/9] relative overflow-hidden bg-slate-100">
                                    <span className={`absolute top-4 left-4 z-10 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full text-white ${item.type === 'event' ? 'bg-blue-600' : 'bg-red-600'
                                        }`}>
                                        {item.type === 'event' ? 'Etkinlik' : 'Kampanya'}
                                    </span>
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">Görsel Yok</div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 font-medium uppercase tracking-wide">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4 text-red-500" />
                                            {item.date_text}
                                        </div>
                                        {item.time_text && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4 text-red-500" />
                                                {item.time_text}
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>

                                    <p className="text-slate-600 text-sm mb-6 line-clamp-3">
                                        {item.description}
                                    </p>

                                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                            {item.location && (
                                                <>
                                                    <MapPin className="w-4 h-4 text-slate-400" />
                                                    {item.location}
                                                </>
                                            )}
                                        </div>
                                        <span className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors">
                                            Detaylı Bilgi
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
