'use client';

import { useState, useEffect } from 'react';
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import MagazineCard from "../cards/MagazineCard";
import { getPublishedArticles } from "@/lib/api";
import { articleToPost, type Post } from "@/lib/types";

// Fallback data
const fallbackLatest: Post[] = [
    { id: 101, title: "These Unusual Tools Can Supercharge Your Workday", category: "Technology", imageSrc: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800", date: "1 year ago", slug: "unusual-tools" },
];
const fallbackEditors: Post[] = [
    { id: 201, title: "Why Doing Less Might Help You Achieve More", category: "Lifestyle", imageSrc: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800", date: "1 year ago", slug: "doing-less" },
];
const fallbackLifestyle: Post[] = [
    { id: 301, title: "The Secret Ingredient Behind Consistent Daily Progress", category: "Fashion", imageSrc: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800", date: "1 year ago", slug: "secret-ingredient" },
];
const fallbackHealth: Post[] = [
    { id: 401, title: "How to Plan Smarter Without Overthinking Everything", category: "Luxury", imageSrc: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=800", date: "1 year ago", slug: "plan-smarter" },
];

export default function MagazineGridSection() {
    const [latestPosts, setLatestPosts] = useState<Post[]>(fallbackLatest);
    const [editorsPosts, setEditorsPosts] = useState<Post[]>(fallbackEditors);
    const [lifestylePosts, setLifestylePosts] = useState<Post[]>(fallbackLifestyle);
    const [healthPosts, setHealthPosts] = useState<Post[]>(fallbackHealth);

    useEffect(() => {
        async function fetchData() {
            try {
                const articles = await getPublishedArticles();
                if (articles.length > 0) {
                    const posts = articles.map(articleToPost);
                    // Distribute articles across sections
                    if (posts[0]) setLatestPosts([posts[0]]);
                    if (posts[1]) setEditorsPosts([posts[1]]);
                    if (posts[2]) setLifestylePosts([posts[2]]);
                    if (posts[3]) setHealthPosts([posts[3]]);
                }
            } catch (error) {
                console.error('Failed to fetch magazine grid articles:', error);
            }
        }
        fetchData();
    }, []);

    return (
        <section className="py-20 bg-background transition-colors border-t border-border">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                    {/* Column 1 */}
                    <div className="flex flex-col gap-16">
                        {/* Latest Posts */}
                        <div className="flex flex-col gap-8">
                            <SectionHeading title="Latest Posts" variant="slashed" align="left" />
                            {latestPosts[0] && (
                                <MagazineCard {...latestPosts[0]} />
                            )}
                        </div>

                        {/* Lifestyle */}
                        <div className="flex flex-col gap-8">
                            <SectionHeading title="Lifestyle" variant="slashed" align="left" />
                            {lifestylePosts[0] && (
                                <MagazineCard {...lifestylePosts[0]} />
                            )}
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col gap-16">
                        {/* Editor's Choice */}
                        <div className="flex flex-col gap-8">
                            <SectionHeading title="Editor's Choice" variant="slashed" align="left" />
                            {editorsPosts[0] && (
                                <MagazineCard {...editorsPosts[0]} />
                            )}
                        </div>

                        {/* Health */}
                        <div className="flex flex-col gap-8">
                            <SectionHeading title="Health" variant="slashed" align="left" />
                            {healthPosts[0] && (
                                <MagazineCard {...healthPosts[0]} />
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
