import Image from 'next/image';

interface HeroProps {
    mediaType?: 'image' | 'video';
    mediaUrl?: string; // URL for video or image
}

export function Hero({ mediaType = 'image', mediaUrl }: HeroProps) {
    return (
        <section className="bg-white py-4">
            <div className="container mx-auto px-4">
                <div className="relative w-full aspect-video md:aspect-auto md:h-[80vh] overflow-hidden bg-black">
                    {/* Background Media */}
                    <div className="absolute inset-0 z-0">
                        {/* Placeholder logic for now, utilizing a dark background if no media */}
                        <div className="absolute inset-0 bg-neutral-900" />

                        {/* We would render Image or Video here based on props */}
                        {/* <Image src={...} alt="Acity Hero" fill className="object-cover" /> */}

                        <div className="absolute inset-0 bg-black/20" /> {/* Overlay for text readability */}
                    </div>

                    {/* Content Container (Optional overlay text) */}
                    <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
                        <div className="max-w-4xl space-y-6">
                            <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tight uppercase">
                                Alışverişin <span className="text-red-500">Keyfi</span>
                                <br />
                                Acity'de Çıkar
                            </h1>
                            <p className="text-white/90 text-lg md:text-xl font-light">
                                Ankara'nın en prestijli markaları ve eğlence dünyası sizi bekliyor.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
