// src/components/cards/StandardCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MetaInfo } from "../ui/MetaInfo";
import { H3, P } from "../ui/typography";
import { cn } from "@/lib/utils";

interface StandardCardProps {
  title: string;
  category: string;
  imageSrc: string;
  date: string;
  slug: string;
  excerpt?: string;
  showReadMore?: boolean;
}

export default function StandardCard({
  title, category, imageSrc, date, slug, excerpt, showReadMore = false
}: StandardCardProps) {
  return (
    <div className="flex flex-col group h-full">
      {/* Image Container */}
      <Link href={`/articles/${slug}`} className="relative w-full aspect-[4/3] overflow-hidden rounded-lg mb-4">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Optional: Add a subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary">{category}</Badge>
          <MetaInfo date={date} />
        </div>

        <Link href={`/articles/${slug}`}>
          <H3 className={cn("text-xl font-bold uppercase text-foreground leading-snug mb-2 group-hover:text-primary transition-colors")}>
            {title}
          </H3>
        </Link>

        {excerpt && (
          <P className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {excerpt}
          </P>
        )}

        {/* Conditional Read More Button (Seen in Slider) */}
        {showReadMore && (
          <div className="mt-auto pt-2">
            <Button asChild variant="outline" size="sm" className="rounded-full text-xs font-bold uppercase tracking-wider">
              <Link href={`/articles/${slug}`}>
                Read More
                <span className="ml-2">↗</span>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}