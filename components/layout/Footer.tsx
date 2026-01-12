'use client';

import Link from 'next/link';
import { Facebook, Instagram, ChevronUp } from 'lucide-react';
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
                    <h2 className="text-4xl md:text-5xl font-light tracking-widest uppercase">ACITY MALL</h2>
                    <h3 className="text-xl md:text-2xl font-light tracking-[0.5em] mt-2">ANKARA</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Left Column */}
                    <div className="space-y-6 md:col-span-2">
                        <h4 className="text-3xl font-bold">Acity Alışveriş ve Eğlence Merkezi</h4>
                        <div className="text-lg space-y-1 text-slate-600">
                            <p>{t('footer.address_line1')}</p>
                            <p>{t('footer.address_line2')}</p>
                            <p>{t('footer.address_city')}</p>
                        </div>

                        <div className="text-lg space-y-1 font-semibold text-slate-800 pt-4">
                            <p>{t('footer.phone')}: 444 3 192</p>
                            <p>{t('footer.email')}: info@acity.com.tr</p>
                        </div>

                        <div className="pt-6">
                            <p className="font-bold text-slate-900 text-lg">{t('footer.hours')} : 10:00 — 22:00</p>
                        </div>
                    </div>

                    {/* Middle Column */}
                    <div>
                        <h4 className="text-3xl font-bold mb-6">{t('footer.brands')}</h4>
                        <ul className="space-y-3 text-lg font-semibold text-slate-800">
                            <li><Link href="/magazalar" className="hover:text-red-600 transition-colors">{t('nav.stores')}</Link></li>
                            <li><Link href="/restorantlar" className="hover:text-red-600 transition-colors">{t('nav.dining')}</Link></li>
                            <li><Link href="/eglence" className="hover:text-red-600 transition-colors">{t('nav.entertainment')}</Link></li>
                        </ul>
                    </div>

                    {/* Right Column */}
                    <div>
                        <h4 className="text-3xl font-bold mb-6">Acity Ankara</h4>
                        <ul className="space-y-3 text-lg font-semibold text-slate-800 mb-8">
                            <li><Link href="/magazalar" className="hover:text-red-600 transition-colors">{t('footer.brands')}</Link></li>
                            <li><Link href="/iletisim" className="hover:text-red-600 transition-colors">{t('footer.write_us')}</Link></li>
                        </ul>

                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Area - Compact */}
                <div className="flex flex-col md:flex-row justify-end items-end mt-4 pt-4 relative">
                    <div className="flex flex-col items-end gap-4">
                        <button
                            onClick={scrollToTop}
                            className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center hover:bg-slate-800 transition-colors shadow-lg"
                            aria-label="Scroll to top"
                        >
                            <ChevronUp className="w-6 h-6" />
                        </button>
                        <p className="text-xs text-slate-500 font-medium">
                            {t('footer.rights')}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
