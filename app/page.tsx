import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { InfoSection } from "@/components/home/InfoSection";
import { ImageBanner } from "@/components/home/ImageBanner";
import { DoubleImageLink } from "@/components/home/DoubleImageLink";
import { StorySection } from "@/components/home/StorySection";
import { FeaturedBrands } from "@/components/home/FeaturedBrands";
import { ScrollingText } from "@/components/home/ScrollingText";
import { Events } from "@/components/home/Events";
import { Cinema } from "@/components/home/Cinema";
import { Services } from "@/components/home/Services";
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

export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <Hero initialData={settings['hero_section']} />
      <InfoSection initialData={settings['info_section']} />
      <ImageBanner initialData={settings['image_banner']} />
      <DoubleImageLink initialData={settings['double_image_link']} />
      <StorySection initialData={settings['story_section']} />
      <FeaturedBrands initialData={settings['featured_brands']} />
      <ScrollingText initialData={settings['scrolling_text']} />
      <Services />
      <Footer />
    </main>
  );
}
