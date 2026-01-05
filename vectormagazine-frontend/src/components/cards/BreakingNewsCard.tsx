"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { H3, Muted, Label } from "../ui/typography";
import { Button } from "../ui/button";

interface BreakingNewsCardProps {
    title: string;
    category: string;
    imageSrc: string;
    date: string;
    slug: string;
}

export default function BreakingNewsCard({
    title,
    category,
    imageSrc,
    date,
    slug,
}: BreakingNewsCardProps) {
    return (
        <Card className="group/card flex h-full flex-col p-7 transition-all duration-300 hover:shadow-card-hover border-border bg-card">
            {/* Image Container */}
            <Link
                href={`/articles/${slug}`}
                className="relative mb-6 aspect-[4/3] w-[150px] overflow-hidden rounded-md"
            >
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                />
            </Link>

            {/* Content */}
            <div className="flex flex-grow flex-col">
                {/* Meta Info */}
                <div className="mb-3 flex items-center gap-3">
                    <Badge variant="secondary" className="uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                        {category}
                    </Badge>
                    <span className="text-muted-foreground text-xs">≠</span>
                    <Muted>{date}</Muted>
                </div>

                {/* Title */}
                <Link href={`/articles/${slug}`} className="mb-6 block">
                    <H3 className="text-[22px] leading-snug transition-colors group-hover/card:text-primary">
                        {title}
                    </H3>
                </Link>

                {/* Read More Button - Custom Pill Shape Implementation using Button asChild */}
                <div className="mt-auto">
                    <Button
                        asChild
                        variant="outline"
                        className="group/btn h-auto rounded-full py-1.5 pl-5 pr-1.5 hover:bg-foreground hover:border-foreground"
                    >
                        <Link href={`/articles/${slug}`}>
                            <Label className="mr-4 group-hover/btn:text-white dark:group-hover/btn:text-black transition-colors">
                                Read More
                            </Label>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background transition-all group-hover/btn:bg-background group-hover/btn:text-foreground">
                                <ArrowUpRight size={14} strokeWidth={2.5} />
                            </div>
                        </Link>
                    </Button>
                </div>
            </div>
        </Card>
    );
}