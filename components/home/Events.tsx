import Link from 'next/link';
import Image from 'next/image';

const EVENTS = [
    {
        id: 1,
        title: "Çocuk Atölyesi: Resim ve Boyama",
        date: "20 Ocak 2024",
        image: "https://images.unsplash.com/photo-1560439514-e960a3ef5019?w=800&q=80"
    },
    {
        id: 2,
        title: "Yazar İmza Günü: Ahmet Ümit",
        date: "25 Ocak 2024",
        image: "https://images.unsplash.com/photo-1459369510627-9efbee1e6051?w=800&q=80"
    },
    {
        id: 3,
        title: "Mini Konser: Yerel Gruplar",
        date: "28 Ocak 2024",
        image: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&q=80"
    }
];

export function Events() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-slate-900">Etkinlikler & Kampanyalar</h2>
                    <Link href="/etkinlikler" className="text-red-600 font-medium hover:underline">
                        Tümünü Gör &rarr;
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {EVENTS.map((event) => (
                        <div key={event.id} className="group cursor-pointer">
                            <div className="aspect-[4/3] bg-zinc-100 rounded-xl overflow-hidden mb-4 relative">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <span className="text-sm text-red-600 font-semibold">{event.date}</span>
                            <h3 className="text-lg font-bold text-slate-900 mt-1 group-hover:text-red-600 transition-colors">{event.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
