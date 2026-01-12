
import Image from 'next/image';

interface ImageBannerProps {
    imageUrl?: string;
    title?: string;
}

export function ImageBanner({
    imageUrl = "https://images.unsplash.com/photo-1517604931442-71053e6e2460?w=1600&q=80", // Cinema/Auditorium placeholder
    title = "HER ADIMDA BİRAZ DAHA PARLA!"
}: ImageBannerProps) {
    return (
        <section className="py-6 bg-white">
            <div className="container mx-auto px-4">
                <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={imageUrl}
                            alt="Banner Background"
                            fill
                            className="object-cover"
                        />
                        {/* Overlay for text readability - slightly darker to match the "shine" contrast */}
                        <div className="absolute inset-0 bg-black/40" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-6xl font-semibold text-white tracking-widest uppercase leading-tight drop-shadow-lg">
                            {title}
                        </h2>
                        {/* Optional decorative elements matching the 'stars' in the screenshot could be added here later */}
                    </div>
                </div>
            </div>
        </section>
    );
}
