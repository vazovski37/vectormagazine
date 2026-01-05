'use client';

import { useState, useEffect } from 'react';
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import BreakingNewsCard from "../cards/BreakingNewsCard";
import { getBreakingNews } from "@/lib/api";
import { articleToPost, type Post } from "@/lib/types";

// Fallback data
const fallbackPosts: Post[] = [
    { id: 1, title: "These Unusual Tools Can Supercharge Your Workday", category: "Travel", imageSrc: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800", date: "1 year ago", slug: "unusual-tools" },
    { id: 2, title: "Why Doing Less Might Help You Achieve More", category: "Family", imageSrc: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800", date: "1 year ago", slug: "doing-less" },
    { id: 3, title: "Creative Routines That Power the Most Productive Minds", category: "Luxury", imageSrc: "https://images.unsplash.com/photo-1496293455970-f8581aae0e3c?q=80&w=800", date: "1 year ago", slug: "creative-routines" },
    { id: 4, title: "The Best Productivity Hacks You've Never Heard Before", category: "Adventures", imageSrc: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800", date: "1 year ago", slug: "productivity-hacks" },
    { id: 5, title: "How Breaks Help You Accomplish More Every Day", category: "Lifestyle", imageSrc: "https://images.unsplash.com/photo-1481437156560-3205f6a55735?q=80&w=800", date: "1 year ago", slug: "breaks-help" },
];

export default function BreakingNewsGridSection() {
    const [posts, setPosts] = useState<Post[]>(fallbackPosts);

    useEffect(() => {
        async function fetchData() {
            try {
                const articles = await getBreakingNews(5);
                if (articles.length > 0) {
                    setPosts(articles.map(articleToPost));
                }
            } catch (error) {
                console.error('Failed to fetch breaking news:', error);
            }
        }
        fetchData();
    }, []);

    // Triple the posts for seamless looping animation
    const repeatedPosts = [...posts, ...posts, ...posts];

    return (
        <section className="py-20 bg-background transition-colors border-t border-border overflow-hidden">
            <Container>
                <SectionHeading title="Breaking News" variant="scribble" align="center" />
            </Container>

            <div className="mt-12 flex flex-col gap-8">
                {/* Top Row - Moves Right to Left */}
                <div className="relative w-full overflow-hidden">
                    <div className="flex gap-8 animate-marquee-left w-max">
                        {repeatedPosts.map((post, index) => (
                            <div key={`top-${index}`} className="w-[477px] flex-shrink-0">
                                <BreakingNewsCard
                                    title={post.title}
                                    category={post.category}
                                    imageSrc={post.imageSrc}
                                    date={post.date}
                                    slug={post.slug}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Row - Moves Left to Right */}
                <div className="relative w-full overflow-hidden">
                    <div className="flex gap-8 animate-marquee-right w-max">
                        {repeatedPosts.map((post, index) => (
                            <div key={`bottom-${index}`} className="w-[477px] flex-shrink-0">
                                <BreakingNewsCard
                                    title={post.title}
                                    category={post.category}
                                    imageSrc={post.imageSrc}
                                    date={post.date}
                                    slug={post.slug}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
