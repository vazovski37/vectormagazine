'use client';

import { useState, useEffect } from 'react';
import OverlayCard from "../cards/OverlayCard";
import HorizontalCard from "../cards/HorizontalCard";
import Container from "../ui/Container";
import { Separator } from "../ui/separator";
import { getPublishedArticles } from "@/lib/api";
import { articleToPost, type Post } from "@/lib/types";

// Fallback data for when API is unavailable
const fallbackHeroPosts: Post[] = [
    { id: 1, title: "The Hidden Power of Saying No at Work", category: "Food", imageSrc: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1000", date: "1 year ago", slug: "hidden-power-saying-no" },
    { id: 2, title: "Tiny Adjustments That Dramatically Improve Daily Output", category: "Health", imageSrc: "https://images.unsplash.com/photo-1544367563-12123d8959bd?q=80&w=1000", date: "1 year ago", slug: "tiny-adjustments" },
    { id: 3, title: "Surprising Ways Distractions Are Draining Your Productivity", category: "Adventures", imageSrc: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000", date: "1 year ago", slug: "surprising-ways" },
];

const fallbackLatestPosts: Post[] = [
    { id: 4, title: "These Unusual Tools Can Supercharge Your Workday", category: "Technology", imageSrc: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800", date: "1 year ago", slug: "unusual-tools" },
    { id: 5, title: "Declutter Your Digital Life in Under One Hour", category: "Interview", imageSrc: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?q=80&w=800", date: "1 year ago", slug: "declutter-digital-life" },
    { id: 6, title: "Creative Routines That Power the Most Productive Minds", category: "Luxury", imageSrc: "https://images.unsplash.com/photo-1496293455970-f8581aae0e3c?q=80&w=800", date: "1 year ago", slug: "creative-routines" },
    { id: 7, title: "The Best Productivity Hacks You've Never Heard", category: "Adventures", imageSrc: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800", date: "1 year ago", slug: "productivity-hacks" },
];

export default function HeroSection() {
    const [heroPosts, setHeroPosts] = useState<Post[]>(fallbackHeroPosts);
    const [latestPosts, setLatestPosts] = useState<Post[]>(fallbackLatestPosts);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const articles = await getPublishedArticles();
                if (articles.length > 0) {
                    const posts = articles.map(articleToPost);
                    setHeroPosts(posts.slice(0, 3));
                    setLatestPosts(posts.slice(3, 7));
                }
            } catch (error) {
                console.error('Failed to fetch articles:', error);
                // Keep fallback data on error
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <section className="py-8 pb-16">
            <Container>
                {/* Top Row: 3 Large Cards */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr] gap-6 mb-12 items-center">
                    {heroPosts.map((post) => (
                        <OverlayCard
                            key={post.id}
                            title={post.title}
                            category={post.category}
                            imageSrc={post.imageSrc}
                            date={post.date}
                            slug={post.slug}
                        />
                    ))}
                </div>

                {/* Bottom Row: 4 Small Horizontal Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 pt-8">
                    <Separator className="col-span-full mb-4" />
                    {latestPosts.map((post) => (
                        <HorizontalCard
                            key={post.id}
                            title={post.title}
                            category={post.category}
                            imageSrc={post.imageSrc}
                            date={post.date}
                            slug={post.slug}
                        />
                    ))}
                </div>
            </Container>
        </section>
    );
}
