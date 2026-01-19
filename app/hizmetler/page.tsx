import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Hizmetler</h1>
                <p className="text-slate-600">Hizmetlerimiz sayfası yapım aşamasındadır.</p>
            </div>
            <Footer />
        </main>
    );
}
