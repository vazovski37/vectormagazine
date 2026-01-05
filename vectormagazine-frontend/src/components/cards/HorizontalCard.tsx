import Image from "next/image";
import Link from "next/link";
import { MetaInfo } from "../ui/MetaInfo";

interface HorizontalCardProps {
    title: string;
    category: string;
    imageSrc: string;
    date: string;
    slug: string;
}

export default function HorizontalCard({ title, category, imageSrc, date, slug }: HorizontalCardProps) {
    return (
        <Link href={`/articles/${slug}`} className="group flex items-center gap-4 h-full">
            {/* Thumbnail */}
            <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                        {category}
                    </span>
                    <span className="text-[9px] text-muted-foreground">•</span>
                    <span className="text-[9px] text-muted-foreground">{date}</span>
                </div>

                <h4 className="text-sm font-bold font-oswald text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {title}
                </h4>
            </div>
        </Link>
    );
}
