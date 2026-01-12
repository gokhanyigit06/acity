
export function Cinema() {
    return (
        <section className="py-20 bg-zinc-900 text-white relative overflow-hidden">
            {/* Decorative Background Element */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-600/20 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                    <h2 className="text-4xl font-bold">Sinema Keyfi Acity'de!</h2>
                    <p className="text-zinc-300 text-lg leading-relaxed">
                        En son vizyon filmleri, konforlu koltuklar ve üstün ses teknolojisi ile Cinevizyon sinemalarında buluşuyor.
                    </p>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
                            Vizyondakiler
                        </button>
                        <button className="px-6 py-3 border border-zinc-600 text-white rounded-lg hover:bg-zinc-800 transition-colors font-semibold">
                            Bilet Al
                        </button>
                    </div>
                </div>

                {/* Visual / Poster Placeholder */}
                <div className="flex-1 w-full flex justify-center">
                    <div className="grid grid-cols-2 gap-4 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <div className="w-40 h-60 bg-zinc-800 rounded-lg shadow-xl" />
                        <div className="w-40 h-60 bg-zinc-800 rounded-lg shadow-xl mt-8" />
                    </div>
                </div>
            </div>
        </section>
    );
}
