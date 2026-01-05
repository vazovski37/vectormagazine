// src/components/cards/OverlayCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { MetaInfo } from "../ui/MetaInfo";
import { H3 } from "../ui/typography";

interface OverlayCardProps {
  title: string;
  category: string;
  imageSrc: string;
  date: string;
  slug: string; // for the link
}

export default function OverlayCard({ title, category, imageSrc, date, slug }: OverlayCardProps) {
  return (
    <Link href={`/articles/${slug}`} className="group relative block w-full h-[400px] overflow-hidden rounded-lg">
      {/* Background Image with Zoom Effect */}
      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Content positioned at bottom */}
      <div className="absolute bottom-0 left-0 p-6 w-full flex flex-col items-start">
        <Badge variant="default" className="mb-2">{category}</Badge>

        <H3 className="text-white text-2xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors uppercase">
          {title}
        </H3>

        {/* Force white text for MetaInfo in this dark context */}
        <div className="text-gray-300">
          <MetaInfo date={date} author="Admin" />
        </div>
      </div>
    </Link>
  );
}