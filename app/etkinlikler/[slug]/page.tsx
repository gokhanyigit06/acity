import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export const revalidate = 0;

async function getEvent(slug: string) {
    try {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('slug', slug)
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error('Supabase Error:', error);
            return null;
        }
        return data;
    } catch (e) {
        console.error('Unexpected Error:', e);
        return null;
    }
}

export default async function EventDetailPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const { slug } = params;

    const event = await getEvent(slug);

    if (!event) {
        // If event is not found, we return 404
        notFound();
    }

    return (
        <main className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            <div className="flex-1 container mx-auto px-4 py-8">
                <Link href="/etkinlikler" className="inline-flex items-center gap-2 text-slate-500 hover:text-red-600 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Etkinliklere Dön
                </Link>

                <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Hero Image */}
                    <div className="aspect-video md:aspect-[21/9] w-full bg-slate-100 relative">
                        {event.image_url && (
                            <img
                                src={event.image_url}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                        )}
                        <span className={`absolute top-6 left-6 z-10 px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-full text-white ${event.type === 'event' ? 'bg-blue-600' : 'bg-red-600'
                            }`}>
                            {event.type === 'event' ? 'Etkinlik' : 'Kampanya'}
                        </span>
                    </div>

                    <div className="p-8 md:p-12 max-w-4xl mx-auto">
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium uppercase tracking-wide mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-red-600" />
                                {event.date_text}
                            </div>
                            {event.time_text && (
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-red-600" />
                                    {event.time_text}
                                </div>
                            )}
                            {event.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-red-600" />
                                    {event.location}
                                </div>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8">
                            {event.title}
                        </h1>

                        <div
                            className="prose prose-lg prose-slate max-w-none"
                            dangerouslySetInnerHTML={{ __html: event.content || event.description }}
                        />
                    </div>
                </article>
            </div>

            <Footer />
        </main>
    );
}
