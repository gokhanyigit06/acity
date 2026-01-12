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

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <Hero />
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
