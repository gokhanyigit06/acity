'use client';

import { Clock, Bus, MapPin } from 'lucide-react';

export function ServiceSchedule() {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Map Image Side */}
                        <div className="relative min-h-[400px] lg:min-h-full bg-slate-100 flex items-center justify-center p-4">
                            <img
                                src="/acity-servis.jpg"
                                alt="Servis Güzergah Haritası"
                                className="max-w-full max-h-full object-contain w-full h-full"
                            />
                        </div>

                        {/* Hours Side */}
                        <div className="p-10 md:p-16 flex flex-col justify-center">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                                    <Bus className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Müşteri Servisleri</h2>
                                    <p className="text-slate-500">Güzergah ve Hareket Saatleri</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {/* Weekdays */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                        <Clock className="w-5 h-5 text-slate-400" />
                                        <h3 className="font-bold text-slate-900">Hafta İçi</h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {["11:00", "12:00", "14:00", "15:00", "16:00", "17:00"].map((time) => (
                                            <li key={time} className="flex items-center gap-3 text-slate-600 font-medium">
                                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                {time}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Weekends */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                        <Clock className="w-5 h-5 text-slate-400" />
                                        <h3 className="font-bold text-slate-900">Hafta Sonu</h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {["11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map((time) => (
                                            <li key={time} className="flex items-center gap-3 text-slate-600 font-medium">
                                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                {time}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Service Stops */}
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                    <MapPin className="w-5 h-5 text-slate-400" />
                                    <h3 className="font-bold text-slate-900">Servis Güzergahı</h3>
                                </div>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                    {[
                                        "Atlantis AVM",
                                        "Batıkent Metro",
                                        "Batıkent Bulvarı",
                                        "YBÜ Girişi",
                                        "Gazi Üniversitesi Caddesi",
                                        "Acity Mall"
                                    ].map((stop, index) => (
                                        <li key={index} className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                                            <div className="flex flex-col items-center gap-0.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                                {index !== 5 && <span className="w-0.5 h-3 bg-slate-200"></span>}
                                            </div>
                                            {stop}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <p className="text-sm text-slate-500 italic">
                                    * Servis saatleri ve güzergahları trafik yoğunluğuna göre değişiklik gösterebilir.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
