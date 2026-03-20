import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import React, { useEffect, useState, useRef } from "react";
import { Plyr } from "plyr-react";
import "plyr-react/plyr.css";
import { ChevronUp, ChevronDown, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/Components/ui/button";

export default function Videos({ videos }) {
    const [allvideos, setAllVideos] = useState(videos || []);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [videoSource, setVideoSource] = useState(null);

    useEffect(() => {
        if (allvideos.length > 0) {
            const currentVideo = allvideos[currentVideoIndex];
            // Find HD quality or take the first available
            const file = currentVideo?.video_files?.find(f => f.quality === 'hd') || currentVideo?.video_files?.[0];
            if (file?.link) {
                setVideoSource({
                    type: "video",
                    sources: [
                        {
                            src: file.link,
                            type: file.file_type || "video/mp4",
                            width:file.width,
                            height:file.height,
                        },
                    ],
                });
            }
        }
    }, [currentVideoIndex, allvideos]);

    const nextVideo = () => {
        if (currentVideoIndex < allvideos.length - 1) {
            setCurrentVideoIndex(prev => prev + 1);
        }
    };

    const prevVideo = () => {
        if (currentVideoIndex > 0) {
            setCurrentVideoIndex(prev => prev - 1);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                nextVideo();
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                prevVideo();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentVideoIndex, allvideos]);

    const plyrProps = {
        source: videoSource,
        options: {
            autoplay: true,
            muted: false,

        },
    };

    return (
        <AuthenticatedLayout header="Video Feed">
            <Head title="Videos" />
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 min-h-[calc(100vh-12rem)] max-w-5xl mx-auto px-4">
                {/* Video Player */}
                <div className="relative w-full aspect-[9/16] max-w-[400px] bg-black rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 border border-white/10 group">
                    {videoSource && (
                        <div className="w-full h-full">
                             <Plyr {...plyrProps}  />
                        </div>
                    )}

                    {/* Navigation Overlays (Optional, but icons show functionality) */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
                        <ChevronUp className="w-3 h-3" /> Use Up/Down Arrows
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-row lg:flex-col gap-4 items-center animate-in slide-in-from-bottom lg:slide-in-from-right duration-700">
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={prevVideo}
                        disabled={currentVideoIndex === 0}
                        className="h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-all border border-white/5 active:scale-95"
                    >
                        <ChevronUp className="h-8 w-8" />
                    </Button>
                    <div className="px-5 py-2 bg-accent/50 rounded-full text-sm font-bold shadow-inner">
                        {currentVideoIndex + 1} / {allvideos.length}
                    </div>
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={nextVideo}
                        disabled={currentVideoIndex === allvideos.length - 1}
                        className="h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-all border border-white/5 active:scale-95"
                    >
                        <ChevronDown className="h-8 w-8" />
                    </Button>
                </div>
            </div>

            {/* Minimal Info */}
            {allvideos[currentVideoIndex] && (
                <div className="mt-8 text-center max-w-md mx-auto animate-in fade-in duration-1000">
                    <h3 className="font-semibold text-lg">{allvideos[currentVideoIndex].user?.name}</h3>
                    <p className="text-muted-foreground text-sm">Popular video from Pexels</p>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
