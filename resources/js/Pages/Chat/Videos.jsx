import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import React, { useEffect, useState, useRef } from "react";
import { Plyr } from "plyr-react";
import "plyr-react/plyr.css";
import { Heart, MessageCircle, Send, Bookmark, MoreVertical, Music2, Share2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

const VideoCard = ({ video, isActive }) => {
    const videoRef = useRef(null);
    const [isLiked, setIsLiked] = useState(false);

    const file = video?.video_files?.find(f => f.quality === 'hd') || video?.video_files?.[0];
    const source = file?.link ? {
        type: "video",
        sources: [
            {
                src: file.link,
                type: file.file_type || "video/mp4",
            },
        ],
    } : null;

    return (
        <div className="relative h-full w-full snap-start flex items-center justify-center overflow-hidden group">
            {/* Blurred Background Overlay */}
            {isActive && file?.link && (
                <div className="absolute inset-0 z-0">
                    <video 
                        src={file.link} 
                        className="w-full h-full object-cover scale-110 blur-[60px] opacity-40" 
                        muted 
                        loop 
                        autoPlay 
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
            )}

            <div className="relative w-full h-full max-w-[450px] aspect-[9/16] bg-neutral-900 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden border-x border-white/5 z-10">
                {isActive && source && (
                    <div className="w-full h-full">
                        <Plyr
                            source={source}
                            options={{
                                autoplay: true,
                                muted: false,
                                loop: { active: true },
                                controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
                            }}
                        />
                    </div>
                )}
                
                {/* Previous overlays and info remain here... */}
                {/* Overlays - Like Reels */}
                <div className="absolute right-4 bottom-24 flex flex-col gap-6 z-20 items-center">
                    <motion.button 
                        whileTap={{ scale: 0.8 }}
                        onClick={() => setIsLiked(!isLiked)}
                        className="flex flex-col items-center gap-1 group/btn"
                    >
                        <div className={`p-3 rounded-full backdrop-blur-md transition-colors ${isLiked ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                        </div>
                        <span className="text-white text-xs font-bold shadow-sm">{isLiked ? '1.2k' : '1.1k'}</span>
                    </motion.button>

                    <button className="flex flex-col items-center gap-1 group/btn">
                        <div className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <span className="text-white text-xs font-bold shadow-sm">42</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 group/btn">
                        <div className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors">
                            <Send className="w-6 h-6" />
                        </div>
                        <span className="text-white text-xs font-bold shadow-sm">12</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 group/btn">
                        <div className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors">
                            <Bookmark className="w-6 h-6" />
                        </div>
                    </button>

                    <button className="flex flex-col items-center gap-1 group/btn">
                        <div className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors">
                            <MoreVertical className="w-6 h-6" />
                        </div>
                    </button>
                    
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="w-10 h-10 rounded-full border-2 border-white/20 p-1 mt-4"
                    >
                        <div className="w-full h-full bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full"></div>
                    </motion.div>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-16 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none">
                    <div className="flex items-center gap-3 mb-3 pointer-events-auto">
                        <Avatar className="h-10 w-10 border border-white/20">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.user?.name}`} />
                            <AvatarFallback>{video.user?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-white font-bold text-sm hover:underline cursor-pointer">{video.user?.name || "Atlas User"}</p>
                            <p className="text-emerald-400 text-xs font-medium">Original Audio</p>
                        </div>
                        <button className="ml-2 px-4 py-1.5 bg-white text-black rounded-full text-xs font-bold hover:bg-neutral-200 transition-colors pointer-events-auto">
                            Follow
                        </button>
                    </div>
                    <p className="text-white/90 text-sm line-clamp-2 mb-3">
                        {video.description || "Discovering the beauty of nature and social networking with Atlas Social. #trending #social #2026"}
                    </p>
                    <div className="flex items-center gap-2 text-white/60 text-xs">
                        <Music2 className="w-3 h-3" />
                        <span>Artist Name - Song Name (Extended Version)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Videos({ videos }) {
    const [allvideos, setAllVideos] = useState(videos || []);
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.getAttribute('data-index'));
                        setActiveIndex(index);
                    }
                });
            },
            { threshold: 0.6 }
        );

        const currentContainer = containerRef.current;
        if (currentContainer) {
            const children = currentContainer.querySelectorAll('.video-card-container');
            children.forEach((child) => observer.observe(child));
        }

        return () => {
            if (currentContainer) {
                const children = currentContainer.querySelectorAll('.video-card-container');
                children.forEach((child) => observer.unobserve(child));
            }
        };
    }, [allvideos]);

    return (
        <AuthenticatedLayout header="Discover Videos">
            <Head title="Videos" />
            
            <div className="fixed inset-x-0 top-16 bottom-0 left-0 lg:left-[280px] bg-transparent overflow-hidden select-none">
                {/* Scrollable Container */}
                <div 
                    ref={containerRef}
                    className="h-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar relative z-10"
                >
                    {allvideos.length > 0 ? (
                        allvideos.map((video, index) => (
                            <div 
                                key={video.id || index} 
                                data-index={index}
                                className="video-card-container h-full w-full"
                            >
                                <VideoCard 
                                    video={video} 
                                    isActive={activeIndex === index} 
                                />
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-white p-6 text-center">
                            <Share2 className="w-16 h-16 text-neutral-800 mb-4" />
                            <h2 className="text-xl font-bold mb-2">No videos yet</h2>
                            <p className="text-neutral-500 max-w-xs">Check back later for trending videos from the community.</p>
                        </div>
                    )}
                </div>

                {/* Vertical Navigation Indicator */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2">
                    {allvideos.slice(0, 10).map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-1 transition-all duration-300 rounded-full ${activeIndex === i ? 'h-8 bg-emerald-500' : 'h-2 bg-white/20'}`}
                        />
                    ))}
                </div>
            </div>

            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
