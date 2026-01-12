'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, Bus, Car } from 'lucide-react';

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Modern Hero Section */}
            <div className="relative w-full h-[600px] flex items-center bg-zinc-900 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0 opacity-60">
                    {/* Standard img tag for reliability */}
                    <img
                        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80"
                        alt="Contact Hero"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="container mx-auto px-4 z-10 relative">
                    <div className="max-w-2xl text-white space-y-6">
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                            Bizimle <br />
                            <span className="text-white">Çevrimiçi</span> <br />
                            Kolayca <br />
                            <span className="text-yellow-400">İletişime</span> Geçin
                        </h1>

                        <p className="text-lg md:text-xl text-zinc-100/90 leading-relaxed max-w-lg">
                            İster alışveriş yapmak, ister yemek yemek, ister sinemaya gitmek veya sadece dinlenmek için gelin; samimi ortamımız ziyaretinizi unutulmaz kılmak için tasarlandı.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button
                                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-colors shadow-lg"
                            >
                                Bize ulaşın
                            </button>

                            <a
                                href="tel:4443192"
                                className="px-8 py-4 bg-yellow-400 text-black font-bold rounded-full flex items-center gap-2 hover:bg-yellow-300 transition-colors shadow-lg"
                            >
                                <Phone className="w-5 h-5" />
                                444 3 192
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Info & Map Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Text Info */}
                    <div className="space-y-10">
                        <div>
                            <h2 className="text-5xl md:text-6xl text-slate-900 tracking-tight">
                                <span className="font-normal">İletişim</span> <span className="font-bold">Bilgileri</span>
                            </h2>
                            <p className="mt-6 text-slate-600 text-lg">
                                Topluluğun bir araya geldiği bir alan olmaktan gurur duyuyoruz.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg mb-2">Adres:</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Macun Mah. Fatih Sultan Mehmet Bulvarı<br />
                                    No:244 Yenimahalle / ANKARA
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg mb-2">Çalışma Saatleri</h3>
                                <p className="text-slate-600 mb-1">Hafta İçi – Hafta Sonu</p>
                                <p className="text-slate-900 font-bold text-xl">10.00-22.00</p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <a
                                href="https://www.google.com/maps/dir//ACity+Outlet+Al%C4%B1%C5%9Fveri%C5%9F+Merkezi/data=!4m8!4m7!1m0!1m5!1m1!1s0x14d34f9a0a0a0a07:0x6c6c6c6c6c6c6c6c!2m2!1d32.7570413!2d39.960966"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-slate-800 transition-colors shadow-lg"
                            >
                                <MapPin className="w-5 h-5" />
                                Yol Tarifi Al
                            </a>
                        </div>
                    </div>

                    {/* Right: Map */}
                    <div className="w-full h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative group">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3058.117187884614!2d32.75704131538356!3d39.96096597942111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34f9a0a0a0a07%3A0x6c6c6c6c6c6c6c6c!2sACity%20Outlet%20Al%C4%B1%C5%9Fveri%C5%9F%20Merkezi!5e0!3m2!1str!2str!4v1620000000000!5m2!1str!2str"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            className="grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                        {/* One-click overlay for direction logic if user just clicks map general area */}
                        <a
                            href="https://www.google.com/maps/dir//ACity+Outlet+Al%C4%B1%C5%9Fveri%C5%9F+Merkezi/data=!4m8!4m7!1m0!1m5!1m1!1s0x14d34f9a0a0a0a07:0x6c6c6c6c6c6c6c6c!2m2!1d32.7570413!2d39.960966"
                            target="_blank"
                            className="absolute inset-0 z-10 block md:hidden"
                            aria-label="Get Directions"
                        />
                    </div>

                </div>
            </div>

            {/* Split Section: Image Left, Form Right */}
            <div id="contact-form" className="bg-slate-50 py-20">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden flex flex-col lg:flex-row">

                        {/* Left Image */}
                        <div className="w-full lg:w-1/2 relative min-h-[500px] lg:min-h-full">
                            {/* Standard img tag for reliability */}
                            <img
                                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&q=80"
                                alt="Shopping"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/10" />
                        </div>

                        {/* Right Form */}
                        <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-20">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Bize Sorun</h2>
                            <p className="text-slate-500 mb-12 text-lg">
                                Sorularınız, geri bildirimleriniz veya yardıma ihtiyacınız mı var?
                                Aşağıdaki formu doldurun, ekibimiz en kısa sürede size geri dönecektir.
                            </p>

                            <form className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-900">İsim</label>
                                        <input type="text" className="w-full h-12 border-b border-slate-300 focus:border-black focus:outline-none transition-colors bg-transparent placeholder:text-transparent" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-900">E-Mail</label>
                                        <input type="email" className="w-full h-12 border-b border-slate-300 focus:border-black focus:outline-none transition-colors bg-transparent placeholder:text-transparent" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-900">Mesajınız</label>
                                    <textarea className="w-full h-32 border-b border-slate-300 focus:border-black focus:outline-none transition-colors bg-transparent resize-none placeholder:text-transparent" />
                                </div>

                                <button className="px-10 py-4 bg-black text-white font-bold rounded-full hover:bg-slate-800 transition-all hover:scale-105 shadow-lg mt-4">
                                    Mesajı Gönder
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </main >
    );
}
