'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
    Wifi,
    Heart,
    Lock,
    Car,
    Tag,
    CreditCard,
    BatteryCharging,
    Laptop,
    Banknote,
    Smile,
    Users,
    HelpingHand
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AboutPage() {
    const [heroImage, setHeroImage] = useState("https://images.unsplash.com/photo-1519567241046-7f570eee3d9f?w=1600&q=80");

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'about_us')
                .single();

            if (data?.value?.image) {
                setHeroImage(data.value.image);
            }
        };

        fetchSettings();
    }, []);

    // Services data
    const services = [
        { name: 'Ücretsiz Hızlı Wi-Fi', icon: Wifi },
        { name: 'Sağlık Odası', icon: Heart },
        { name: 'Emanet Dolapları', icon: Lock },
        { name: 'Park & Valet', icon: Car },
        { name: 'Kuru Temizleme', icon: Tag },
        { name: 'ATM & Bankalar', icon: CreditCard },
        { name: 'Mobil Şarj İstasyonu', icon: BatteryCharging },
        { name: 'Çalışma Alanları', icon: Laptop },
        { name: 'Döviz Bürosu', icon: Banknote },
        { name: 'Bebek Bakım Odası', icon: Smile },
        { name: 'Engelli Hizmetleri', icon: Users }, // Generalized icon
        { name: 'Ödeme Desteği', icon: HelpingHand },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[40vh] min-h-[400px] w-full overflow-hidden">
                <img
                    src={heroImage}
                    alt="Acity Mall"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-widest uppercase text-center">HAKKIMIZDA</h1>
                    <div className="w-24 h-1 bg-white mt-6 rounded-full opacity-80" />
                </div>
            </div>

            {/* Main Story Section */}
            <section className="py-20 container mx-auto px-4 max-w-5xl">
                <div className="text-center space-y-8">
                    <span className="text-red-600 font-bold tracking-widest uppercase text-sm block">ALIŞVERİŞİN PARLAYAN YILDIZI</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                        Acity Mall, Ankara’nın alışveriş ve yaşam kültüründe değişimi izleyen ve yeniliği belirleyen bir konumda yer alıyor.
                    </h2>
                    <div className="text-lg text-slate-600 leading-relaxed space-y-6 max-w-3xl mx-auto">
                        <p>
                            Kuruluş yıllarındaki outlet kimliğinden üst segment bir alışveriş merkezine dönüşerek, seçkin markaları ve özgün deneyimleri bir araya getiriyor.
                        </p>
                        <p>
                            Ne istediğini bilen ziyaretçi profiliyle, mağazaların değerini yükselten bir buluşma noktası olarak öne çıkıyor. Her adımıyla Ankara’nın prestijini parlatan Acity, bugün olduğu kadar gelecekte de başkentin yıldızı olmaya devam etmek için gelişimini sürdürüyor.
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl font-bold text-slate-900">Hizmetlerimiz</h3>
                        <p className="text-slate-500 mt-2 text-lg">Konforunuz için düşündüğümüz ayrıcalıklar.</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {services.map((service, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center gap-4 group">
                                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                                    <service.icon className="w-8 h-8" />
                                </div>
                                <h4 className="font-semibold text-slate-800 group-hover:text-red-600 transition-colors">{service.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sustainability & Values */}
            <section className="py-20 container mx-auto px-4 max-w-7xl">
                <div className="mb-16 text-center">
                    <span className="text-red-600 font-semibold tracking-wide uppercase text-sm">DEĞERLERİMİZ</span>
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Sürdürülebilirlik ve Vizyonumuz</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Card 1 */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl hover:-translate-y-2 transition-transform duration-300">
                        <div className="mb-6">
                            <h4 className="text-2xl font-bold text-slate-900 mb-2">Enerji Politikamız</h4>
                            <div className="w-12 h-1 bg-red-500 rounded-full" />
                        </div>
                        <ul className="text-slate-600 space-y-3 list-disc pl-5 leading-relaxed">
                            <li>Enerji verimliliğini temel alıyor, gelisen teknolojilerle performansımızı sürekli iyileştiriyoruz.</li>
                            <li>Güçlü bir enerji yönetim sistemi yürütüyoruz.</li>
                            <li>Tüm yasal gerekliliklere tam uyum sağlıyoruz.</li>
                            <li>Çalışanlarımızın bilinç düzeyini eğitimlerle artırıyoruz.</li>
                            <li>Enerji verimli tasarımları tercih ederek geleceğe yatırım yapıyoruz.</li>
                        </ul>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl hover:-translate-y-2 transition-transform duration-300">
                        <div className="mb-6">
                            <h4 className="text-2xl font-bold text-slate-900 mb-2">Çevre Duyarlılığımız</h4>
                            <div className="w-12 h-1 bg-green-500 rounded-full" />
                        </div>
                        <ul className="text-slate-600 space-y-3 list-disc pl-5 leading-relaxed">
                            <li>Doğal kaynakları koruyan çevre dostu mimari ve sistemler uyguluyoruz.</li>
                            <li>Atık yönetimi ve geri dönüşüm süreçleriyle karbon ayak izini azaltıyoruz.</li>
                            <li>Enerji tasarrufu sağlayan teknolojilerle sürdürülebilir kent yaşamına katkı sunuyoruz.</li>
                            <li>Yeşil alan düzenlemeleriyle doğaya saygı duyuyoruz.</li>
                        </ul>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl hover:-translate-y-2 transition-transform duration-300">
                        <div className="mb-6">
                            <h4 className="text-2xl font-bold text-slate-900 mb-2">Toplumsal Sorumluluk</h4>
                            <div className="w-12 h-1 bg-blue-500 rounded-full" />
                        </div>
                        <ul className="text-slate-600 space-y-3 list-disc pl-5 leading-relaxed">
                            <li>Eğitim, kültür, sanat ve spor projeleriyle topluma değer katıyoruz.</li>
                            <li>Yerel işletmelerle iş birliği yaparak bölge ekonomisini güçlendiriyoruz.</li>
                            <li>Eşitlikçi, kapsayıcı ve güvenli bir sosyal ortam sunuyoruz.</li>
                            <li>Çocuklar ve gençlerin geleceğine ışık tutan projelere öncelik veriyoruz.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
