
import Image from 'next/image';
import Link from 'next/link';

interface CategoryCardProps {
    title: string;
    image: string;
    href: string;
}

const CATEGORIES = [
    {
        title: "Lezzetin Adresi: Cafe & Restoran",
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80", // Restaurant/Food
        href: "/dining"
    },
    {
        title: "Modanın Kalbi: Giyim & Aksesuar",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80", // Fashion/Shopping
        href: "/stores"
    }
];

export function DoubleImageLink() {
    return (
        <section className="pb-10 pt-4 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {CATEGORIES.map((cat, idx) => (
                        <Link
                            key={idx}
                            href={cat.href}
                            className="relative aspect-square group overflow-hidden block"
                        >
                            <Image
                                src={cat.image}
                                alt={cat.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Gradient Overlay for Text Visibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                            {/* Title */}
                            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
                                <h3 className="text-3xl md:text-5xl text-white font-medium tracking-wide">
                                    {cat.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
