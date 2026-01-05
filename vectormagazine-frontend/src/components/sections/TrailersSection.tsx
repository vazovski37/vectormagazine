"use client";
import { useState } from "react";
import Container from "../ui/Container";
import VideoSideCard from "../cards/VideoSideCard";
import { trailerVideos } from "@/lib/data";

export default function TrailersSection() {
    const [activeVideo, setActiveVideo] = useState(trailerVideos[0]);

    return (
        <section className="relative py-20 bg-muted transition-colors overflow-hidden">
            {/* Background Decorative Text */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none overflow-hidden">
                <div className="text-[20vw] font-black font-oswald text-card uppercase opacity-100 whitespace-nowrap leading-none mix-blend-overlay">
                    Trailers # Trailers # Trailers
                </div>
            </div>

            <Container className="relative z-10">
                <div className="flex flex-col lg:flex-row bg-card shadow-2xl rounded-none lg:h-[500px]">

                    {/* Left: Main Video Player */}
                    <div className="w-full lg:w-2/3 h-[300px] lg:h-full bg-black relative">
                        <iframe
                            src={activeVideo.videoUrl}
                            title={activeVideo.title}
                            className="w-full h-full object-cover"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                        {/* Overlay Title on Video if needed, though YouTube embed shows it */}
                    </div>

                    {/* Right: Playlist */}
                    <div className="w-full lg:w-1/3 flex flex-col border-l border-border">
                        <div className="overflow-y-auto custom-scrollbar p-2 h-full">
                            {trailerVideos.map((video, idx) => (
                                <div key={video.id} className="mb-2 last:mb-0">
                                    <VideoSideCard
                                        index={idx + 1}
                                        title={video.title}
                                        imageSrc={video.imageSrc}
                                        isActive={activeVideo.id === video.id}
                                        onClick={() => setActiveVideo(video)}
                                    />
                                    {idx < trailerVideos.length - 1 && <div className="h-[1px] bg-border mx-4 my-2" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
