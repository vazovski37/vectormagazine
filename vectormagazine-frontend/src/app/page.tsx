import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
// FloatingActions removed as it is replaced by Sidebars
import BreakingNewsBar from "@/components/sections/BreakingNewsBar";
import HeroSection from "@/components/sections/HeroSection";
import BreakingNewsGridSection from "@/components/sections/BreakingNewsGridSection";
import TrailersSection from "@/components/sections/TrailersSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import MagazineGridSection from "@/components/sections/MagazineGridSection";

export default function Home() {
  return (
    <div className="min-h-screen w-full custom-scrollbar font-inter">
      <Header />

      <main className="w-full" >
        <BreakingNewsBar />
        <HeroSection />
        {/* Latest Posts are now integrated into the bottom of HeroSection */}
        <BreakingNewsGridSection />
        <TrailersSection />
        <NewsletterSection />
        <MagazineGridSection />
      </main>

      <Footer />

    </div>
  );
}