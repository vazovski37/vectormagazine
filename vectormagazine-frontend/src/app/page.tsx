import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
// FloatingActions removed as it is replaced by Sidebars
import BreakingNewsBar from "@/components/sections/BreakingNewsBar";
import HeroSection from "@/components/sections/HeroSection";
import BreakingNewsGridSection from "@/components/sections/BreakingNewsGridSection";
import TrailersSection from "@/components/sections/TrailersSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import MagazineGridSection from "@/components/sections/MagazineGridSection";
import { getHeroArticles, getLatestArticles, getBreakingNews } from "@/lib/api";
import { articleToPost, type Article } from "@/lib/types";

// Enable ISR (Incremental Static Regeneration)
// This page will be statically generated and revalidated ONLY
// when explicitly requested via the /api/revalidate endpoint
// export const revalidate = 60; // Removed for On-Demand ISR

export default async function Home() {
  // Fetch data during build/ISR
  let heroArticles: Article[] = [];
  let latestArticles: Article[] = [];
  let breakingNewsArticles: Article[] = [];

  try {
    [heroArticles, latestArticles, breakingNewsArticles] = await Promise.all([
      getHeroArticles(),
      getLatestArticles(4),
      getBreakingNews(5)
    ]);
  } catch (error) {
    console.warn('Failed to fetch articles for homepage (backend might be down during build):', error);
  }

  const initialHeroPosts = heroArticles.map(articleToPost);
  const initialLatestPosts = latestArticles.map(articleToPost);
  const initialBreakingNews = breakingNewsArticles.map(articleToPost);

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MOW Creative Magazine',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://vectormagazine.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vectormagazine.com'}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <div className="min-h-screen w-full custom-scrollbar font-inter">
      {/* Add JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="w-full" >
        <BreakingNewsBar />
        <HeroSection
          initialHeroPosts={initialHeroPosts}
          initialLatestPosts={initialLatestPosts}
        />
        {/* Latest Posts are now integrated into the bottom of HeroSection */}
        <BreakingNewsGridSection initialPosts={initialBreakingNews} />
        <TrailersSection />
        <NewsletterSection />
        <MagazineGridSection />
      </main>

      <Footer />

    </div>
  );
}