// src/components/ui/MetaInfo.tsx
import React from "react";
import { Muted } from "./typography";
import { cn } from "@/lib/utils";

interface MetaInfoProps {
  date: string;
  author?: string;
  className?: string;
}

export function MetaInfo({ date, author, className }: MetaInfoProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {author && (
        <>
          <Muted className="font-semibold text-foreground">{author}</Muted>
          <span className="h-1 w-1 rounded-full bg-muted-foreground" />
        </>
      )}
      <Muted>{date}</Muted>
    </div>
  );
}