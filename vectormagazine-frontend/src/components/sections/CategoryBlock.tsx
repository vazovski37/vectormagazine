import Link from "next/link";
import SectionHeading from "../ui/SectionHeading";
import StandardCard from "../cards/StandardCard";
import HorizontalCard from "../cards/HorizontalCard";

interface Post {
    id: number;
    title: string;
    category: string;
    imageSrc: string;
    date: string;
    slug: string;
}

interface CategoryBlockProps {
    title: string;
    posts: Post[];
}

export default function CategoryBlock({ title, posts }: CategoryBlockProps) {
    if (!posts || posts.length === 0) return null;

    const mainPost = posts[0];
    const sidePosts = posts.slice(1);

    return (
        <div className="flex flex-col gap-6">
            <SectionHeading title={title} variant="slashed" align="left" />

            {/* Main Feature Post */}
            <StandardCard
                title={mainPost.title}
                category={mainPost.category}
                imageSrc={mainPost.imageSrc}
                date={mainPost.date}
                slug={mainPost.slug}
            />

            {/* Side Posts List */}
            <div className="flex flex-col gap-6 pt-6 border-t border-border">
                {sidePosts.map((post) => (
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
        </div>
    );
}
