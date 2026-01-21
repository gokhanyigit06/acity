import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { HomeSections } from "@/components/home/HomeSections";
import { ImageBanner } from "@/components/home/ImageBanner";


import { Events } from "@/components/home/Events";
import { Cinema } from "@/components/home/Cinema";

import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Ensure fresh data on every request

async function getSiteSettings() {
  const { data } = await supabase
    .from('site_settings')
    .select('key, value');

  if (!data) return {};

  const settings: Record<string, any> = {};
  data.forEach(item => {
    settings[item.key] = item.value;
  });

  return settings;
}

// Default data in case DB is empty or new key hasn't been migrated yet
const DEFAULT_HOME_SECTIONS = [
  {
    id: 'default-info',
    type: 'info',
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    smallTitle: "Yeniliğin Işığı",
    bigTitle: "Senin Yıldızın\nParlak!",
    description: "Acity için yıldız yalnızca bir sembol değil; aynı zamanda iyiliğe yön veren bir pusula. Acity'nin enerji verimliliğini ve çevreyi önceleyen uygulamaları da bu pusulanın bir parçası."
  },
  {
    id: 'default-story',
    type: 'story',
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    title: "ALIŞVERİŞİN\nPARLAYAN YILDIZI",
    description: "Acity Mall, Ankara'nın alışveriş ve yaşam kültüründe değişimi izleyen ve yeniliği belirleyen bir konumda yer alıyor."
  }
];

export default async function Home() {
  const settings = await getSiteSettings();

  // Fallback to default if home_sections missing
  const homeSections = settings['home_sections'] || DEFAULT_HOME_SECTIONS;

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <Hero initialData={settings['hero_section']} />

      {/* Dynamic Home Sections */}
      <HomeSections sections={homeSections} />

      <ImageBanner initialData={settings['image_banner']} />



      <Footer />
    </main>
  );
}
