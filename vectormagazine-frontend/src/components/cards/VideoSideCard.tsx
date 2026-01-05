// src/components/cards/VideoSideCard.tsx
import Image from "next/image";

interface VideoSideCardProps {
  index: number;
  title: string;
  imageSrc: string;
  isActive?: boolean; // To highlight the currently playing video
  onClick: () => void;
}

export default function VideoSideCard({ index, title, imageSrc, isActive = false, onClick }: VideoSideCardProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-4 p-3 rounded-lg cursor-pointer transition-colors ${isActive ? "bg-accent" : "hover:bg-muted"
        }`}
    >
      {/* The Number */}
      <span className="text-2xl font-black text-muted-foreground/50 mt-1 select-none">
        {index}
      </span>

      {/* Thumbnail */}
      <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden bg-muted">
        <Image src={imageSrc} alt={title} fill className="object-cover" />
        {/* Mini Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Title */}
      <h4 className={`text-sm font-bold leading-snug line-clamp-2 ${isActive ? "text-primary" : "text-foreground"}`}>
        {title}
      </h4>
    </div>
  );
}