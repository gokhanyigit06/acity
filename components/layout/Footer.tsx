'use client';

import Link from 'next/link';
import { Facebook, Instagram, ChevronUp, Linkedin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
    const { t } = useLanguage();
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-white text-slate-900 pt-16 pb-4 border-t border-slate-100">
            <div className="container mx-auto px-4 relative">

                {/* Top Center Brand */}
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-5xl font-light tracking-widest uppercase">ACITY MALL</h2>
                    <h3 className="text-sm md:text-2xl font-light tracking-[0.5em] mt-2">ANKARA</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
                    {/* Left Column */}
                    <div className="space-y-4 md:space-y-6 md:col-span-2">
                        <h4 className="text-2xl md:text-3xl font-bold">Acity Alışveriş ve Eğlence Merkezi</h4>
                        <div className="text-sm md:text-lg space-y-1 text-slate-600">
                            <p>{t('footer.address_line1')}</p>
                            <p>{t('footer.address_line2')}</p>
                            <p>{t('footer.address_city')}</p>
                        </div>

                        <div className="text-sm md:text-lg space-y-1 font-semibold text-slate-800 pt-2 md:pt-4">
                            <p>{t('footer.phone')}: 444 3 192</p>
                            <p>{t('footer.email')}: info@a1grup.com.tr</p>
                        </div>

                        <div className="pt-4 md:pt-6">
                            <p className="font-bold text-slate-900 text-base md:text-lg">{t('footer.hours')} : 10:00 — 22:00</p>
                        </div>
                    </div>



                    {/* Right Column */}
                    <div>
                        <h4 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Acity Ankara</h4>
                        <ul className="space-y-2 md:space-y-3 text-sm md:text-lg font-semibold text-slate-800 mb-6 md:mb-8">
                            <li><Link href="/hakkimizda" className="hover:text-red-600 transition-colors">Hakkımızda</Link></li>
                            <li><Link href="/iletisim" className="hover:text-red-600 transition-colors">{t('footer.write_us')}</Link></li>
                        </ul>

                        <div className="flex gap-4">
                            <Link href="#" className="w-8 h-8 md:w-10 md:h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors">
                                <Instagram className="w-4 h-4 md:w-5 md:h-5" />
                            </Link>
                            <Link href="#" className="w-8 h-8 md:w-10 md:h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors">
                                <Facebook className="w-4 h-4 md:w-5 md:h-5" />
                            </Link>
                            <Link href="#" className="w-8 h-8 md:w-10 md:h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors">
                                <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Area - Compact */}
                <div className="flex flex-col md:flex-row justify-end items-end mt-4 pt-4 relative">
                    <div className="flex flex-col items-end gap-3 md:gap-4">
                        <button
                            onClick={scrollToTop}
                            className="w-10 h-10 md:w-12 md:h-12 bg-black text-white rounded-lg flex items-center justify-center hover:bg-slate-800 transition-colors shadow-lg"
                            aria-label="Scroll to top"
                        >
                            <ChevronUp className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <p className="text-[10px] md:text-xs text-slate-500 font-medium">
                            {t('footer.rights')}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
