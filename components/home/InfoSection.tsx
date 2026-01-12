
import Image from 'next/image';

export function InfoSection() {
    return (
        <section className="py-10 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
                    {/* Left Side - Image */}
                    <div className="w-full md:w-1/2 relative aspect-[4/3] md:aspect-square">
                        <div className="relative w-full h-full overflow-hidden shadow-xl">
                            <Image
                                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" // Fashion placeholder
                                alt="Senin Yıldızın Parlak"
                                fill
                                className="object-cover"
                            />
                            {/* Star overlay effect simulation if needed, for now just image */}
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="w-full md:w-1/2 text-center flex flex-col items-center justify-center space-y-8">
                        <h3 className="text-xl font-bold text-slate-900 tracking-wide">
                            Yeniliğin Işığı
                        </h3>

                        <h2 className="text-4xl md:text-6xl font-light text-slate-900 leading-tight uppercase tracking-wider">
                            Senin Yıldızın<br />Parlak!
                        </h2>

                        <div className="w-24 h-px bg-slate-300 my-4" />

                        <p className="text-slate-600 text-lg leading-relaxed max-w-lg mx-auto">
                            Acity için yıldız yalnızca bir sembol değil; aynı zamanda iyiliğe
                            yön veren bir pusula. Acity'nin enerji verimliliğini ve çevreyi
                            önceleyen uygulamaları da bu pusulanın bir parçası.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
