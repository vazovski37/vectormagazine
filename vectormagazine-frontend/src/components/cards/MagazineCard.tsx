import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { H3 } from "../ui/typography";

interface MagazineCardProps {
    title: string;
    category: string;
    imageSrc: string;
    date: string;
    slug: string;
    className?: string;
}

export default function MagazineCard({
    title,
    category,
    imageSrc,
    date,
    slug,
    className
}: MagazineCardProps) {
    return (
        <Link
            href={`/articles/${slug}`}
            className={cn(
                "group grid grid-cols-[1fr_1.5fr] gap-6 items-start h-full",
                className
            )}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col h-full pt-1">
                {/* Meta Line */}
                <div className="flex items-center gap-2 mb-3 text-[11px] font-bold tracking-wider uppercase text-muted-foreground">
                    <span className="text-foreground">{category}</span>
                    <span className="text-muted-foreground">#</span>
                    <span className="font-normal normal-case tracking-normal">{date}</span>
                </div>

                {/* Exclusive Badge */}
                <div className="mb-3">
                    <div className="inline-block bg-[#FF9900] text-black text-[11px] font-bold px-3 py-1 italic transform -skew-x-12">
                        <span className="inline-block transform skew-x-12">Exclusive</span>
                    </div>
                </div>

                {/* Title */}
                <H3 className="text-xl md:text-2xl leading-tight transition-colors group-hover:text-primary">
                    {title}
                </H3>
            </div>
        </Link>
    );
}
