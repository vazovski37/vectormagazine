import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import StandardCard from "../cards/StandardCard";
import { latestPosts } from "@/lib/data";

export default function LatestPostsSection() {
    return (
        <section className="py-20 bg-white dark:bg-mow-dark transition-colors">
            <Container>
                <SectionHeading title="Latest Posts" variant="slashed" align="left" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {latestPosts.map((post) => (
                        <StandardCard
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
