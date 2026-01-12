
import Image from 'next/image';

export function StorySection() {
    return (
        <section className="pb-10 pt-4 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Content */}
                    <div className="w-full text-center flex flex-col items-center justify-center space-y-8 order-2 md:order-1">
                        <h2 className="text-4xl md:text-5xl font-light text-slate-900 leading-tight uppercase tracking-wider">
                            ALIŞVERİŞİN<br />PARLAYAN YILDIZI
                        </h2>

                        <p className="text-slate-600 text-lg leading-relaxed max-w-lg mx-auto">
                            Acity Mall, Ankara'nın alışveriş ve yaşam kültüründe değişimi
                            izleyen ve yeniliği belirleyen bir konumda yer alıyor. Kuruluş
                            yıllarındaki outlet kimliğinden üst segment bir alışveriş
                            merkezine dönüşerek, seçkin markaları ve özgün deneyimleri
                            bir araya getiriyor.
                        </p>
                    </div>

                    {/* Right Side - Image */}
                    <div className="relative aspect-square w-full order-1 md:order-2">
                        <div className="relative w-full h-full overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" // Shopping/Fashion placeholder
                                alt="Alışverişin Parlayan Yıldızı"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
