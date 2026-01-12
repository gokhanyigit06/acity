import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { InfoSection } from "@/components/home/InfoSection";
import { ImageBanner } from "@/components/home/ImageBanner";
import { DoubleImageLink } from "@/components/home/DoubleImageLink";
import { StorySection } from "@/components/home/StorySection";
import { FeaturedBrands } from "@/components/home/FeaturedBrands";
import { Events } from "@/components/home/Events";
import { Cinema } from "@/components/home/Cinema";
import { Services } from "@/components/home/Services";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Ensure fresh data on every request

async function getHeroSettings() {
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'hero_section')
    .single();

  return data?.value || null;
}

export default async function Home() {
  const heroSettings = await getHeroSettings();

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <Hero initialData={heroSettings} />
      <InfoSection />
      <ImageBanner />
      <DoubleImageLink />
      <StorySection />
      <FeaturedBrands />
      <Services />
      <Footer />
    </main>
  );
}
