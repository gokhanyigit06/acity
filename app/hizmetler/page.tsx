import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
    Wifi, Stethoscope, Luggage, Zap,
    ParkingCircle, Shirt, CreditCard, Handshake,
    Smartphone, Laptop, RefreshCcw,
    Baby, Accessibility, Wallet
} from 'lucide-react';

const SERVICES = [
    {
        icon: Wifi,
        title: "Ücretsiz Hızlı Wi-Fi",
        description: "Alışveriş merkezimizin her noktasında kesintisiz ve hızlı internet deneyimi sunuyoruz. Bağlantı için 'Acity_Guest' ağını seçmeniz yeterlidir."
    },
    {
        icon: Stethoscope,
        title: "Sağlık",
        description: "Acil durumlar ve sağlık ihtiyaçlarınız için revirimiz ve uzman sağlık personelimiz zemin katta hizmetinizdedir."
    },
    {
        icon: Luggage,
        title: "Emanet",
        description: "Ağır eşyalarınızı ve alışveriş poşetlerinizi güvenle bırakabileceğiniz emanet dolaplarımız danışma noktasında mevcuttur."
    },
    {
        icon: Zap,
        title: "Araç Şarj İstasyonu",
        description: "Elektrikli araçlarınız için kapalı otopark alanımızda hızlı şarj istasyonlarımız bulunmaktadır."
    },
    {
        icon: ParkingCircle,
        title: "Park & Valet",
        description: "Geniş kapasiteli kapalı ve açık otoparkımız ve profesyonel vale hizmetimizle park sorunu yaşamayın."
    },
    {
        icon: Shirt,
        title: "Kuru Temizleme",
        description: "Kıyafetleriniz için hızlı ve güvenilir kuru temizleme hizmetimiz alt zemin katta yer almaktadır."
    },
    {
        icon: CreditCard,
        title: "ATM & Bankalar",
        description: "Tüm bankacılık işlemlerinizi gerçekleştirebileceğiniz ATM alanlarımız ve banka şubelerimiz mevcuttur."
    },
    {
        icon: Handshake,
        title: "Müşteri Servisi",
        description: "Görüş, öneri ve şikayetleriniz için danışma bankomuz haftanın her günü hizmetinizdedir."
    },
    {
        icon: Smartphone,
        title: "Mobil Şarj İstasyonu",
        description: "Telefonunuzun şarjı bitmesin diye ortak alanlarda kullanabileceğiniz powerbank kiralama istasyonlarımız mevcuttur."
    },
    {
        icon: Laptop,
        title: "Çalışma Masaları",
        description: "Sessiz bir ortamda çalışmak veya ders çalışmak isteyen misafirlerimiz için özel çalışma alanlarımız bulunmaktadır."
    },
    {
        icon: RefreshCcw,
        title: "Döviz Para Çevirme",
        description: "Yabancı para birimlerini güncel kurlardan çevirebileceğiniz döviz büromuz hizmetinizdedir."
    },
    {
        icon: Baby,
        title: "Bebek Odası",
        description: "Annelerin bebeklerinin bakımını rahatça yapabileceği, hijyenik ve modern bebek bakım odalarımız her katta mevcuttur."
    },
    {
        icon: Accessibility,
        title: "Engelli Arabası",
        description: "Yürüme güçlüğü çeken misafirlerimiz için danışma noktasından ücretsiz tekerlekli sandalye temin edebilirsiniz."
    },
    {
        icon: Wallet,
        title: "Ödeme Desteği",
        description: "Mağazalarımızda ve ortak alanlarda temassız ödeme ve çeşitli ödeme kolaylıkları sağlanmaktadır."
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {SERVICES.map((service, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors duration-300">
                                <service.icon className="w-7 h-7 text-red-600 group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </main>
    );
}
