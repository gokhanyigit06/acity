'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
    Wifi, Stethoscope, Zap,
    Shirt, CreditCard,
    Smartphone, Laptop,
    Baby, Accessibility, Bath, Moon, Car, Bus,
    Footprints, Scissors, Pill, ParkingCircle, Droplets,
    CarTaxiFront, Sparkles
} from 'lucide-react';


import { ServiceSchedule } from '@/components/shared/ServiceSchedule';

const SERVICES = [
    {
        icon: Wifi,
        title: "Ücretsiz Hızlı Wi-Fi",
    },
    {
        icon: Stethoscope,
        title: "Sağlık",
    },
    {
        icon: Zap,
        title: "Araç Şarj İstasyonu",
    },
    {
        icon: Shirt,
        title: "Kuru Temizleme",
    },
    {
        icon: CreditCard,
        title: "ATM",
    },

    {
        icon: Smartphone,
        title: "Mobil Şarj İstasyonu",
    },
    {
        icon: Laptop,
        title: "Çalışma Masaları",
    },
    {
        icon: Baby,
        title: "Bebek Odası",
    },
    {
        icon: Accessibility,
        title: "Engelli Arabası",
    },
    {
        icon: Bath,
        title: "WC",
    },
    {
        icon: Moon,
        title: "Mescit",
    },
    {
        icon: Car,
        title: "Çocuk Arabası",
    },
    {
        icon: Bus,
        title: "Müşteri Servisleri",
    },
    {
        icon: Footprints,
        title: "Lostra",
    },
    {
        icon: Scissors,
        title: "Kuaför & Berber",
    },
    {
        icon: Pill,
        title: "Eczane",
    },
    {
        icon: ParkingCircle,
        title: "Otopark",
    },
    {
        icon: Droplets,
        title: "Su Matik",
    },
    {
        icon: Sparkles,
        title: "Oto Yıkama",
    },
    {
        icon: CarTaxiFront,
        title: "Taksi",
    },
];

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200">
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Hizmetlerimiz</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Alışveriş deneyiminizi konforlu ve keyifli hale getirmek için sunduğumuz ayrıcalıklı hizmetler.
                    </p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {SERVICES.map((service, index) => (
                        <div
                            key={index}
                            onClick={service.title === "Müşteri Servisleri" ? () => document.getElementById('service-schedule')?.scrollIntoView({ behavior: 'smooth' }) : undefined}
                            className={`bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group h-full justify-center ${service.title === "Müşteri Servisleri" ? 'cursor-pointer ring-2 ring-transparent hover:ring-red-100' : ''}`}
                        >
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors duration-300">
                                <service.icon className="w-8 h-8 text-red-600 group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">{service.title}</h3>
                        </div>
                    ))}
                </div>
            </div>

            <div id="service-schedule">
                <ServiceSchedule />
            </div>

            <Footer />
        </main>
    );
}
