import {
    Wifi, Stethoscope, Luggage, Zap,
    ParkingCircle, Shirt, CreditCard, Handshake,
    Smartphone, Laptop, RefreshCcw,
    Baby, Accessibility, Wallet, Car, Bus
} from 'lucide-react';

const SERVICES = [
    { icon: Wifi, title: "Ücretsiz Hızlı Wi-Fi" },
    { icon: Stethoscope, title: "Sağlık" },
    { icon: Zap, title: "Araç Şarj İstasyonu" },
    { icon: Shirt, title: "Kuru Temizleme" },
    { icon: CreditCard, title: "ATM" },
    { icon: Handshake, title: "Müşteri Servisi" },
    { icon: Smartphone, title: "Mobil Şarj İstasyonu" },
    { icon: Laptop, title: "Çalışma Masaları" },
    { icon: Baby, title: "Bebek Odası" },
    { icon: Accessibility, title: "Engelli Arabası" },
    { icon: Car, title: "Çocuk Arabası" },
    { icon: Bus, title: "Müşteri Servisleri" },
];

export function Services() {
    return (
        <section className="py-10 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Left Title Area */}
                    <div className="w-full md:w-1/4 flex items-center md:items-start">
                        <h2 className="text-4xl md:text-6xl font-normal text-slate-700 tracking-tight">
                            Hizmetler
                        </h2>
                    </div>

                    {/* Right Grid Area */}
                    <div className="w-full md:w-3/4">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
                            {SERVICES.map((service, index) => (
                                <div key={index} className="flex items-center gap-3 text-slate-800 group cursor-pointer">
                                    <service.icon className="w-8 h-8 stroke-[1.5] group-hover:text-red-500 transition-colors" />
                                    <span className="text-sm font-bold leading-tight">
                                        {service.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
