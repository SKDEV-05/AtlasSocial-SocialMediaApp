import { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";

export default function AudioPlayer({ src, className }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
    };

    const formatTime = (time) => {
        if (!time) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    return (
        <div className={cn("flex items-center gap-2 min-w-[200px] w-full", className)}>
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                className="hidden"
            />
            
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-black/10 dark:hover:bg-white/10 shrink-0"
                onClick={togglePlay}
            >
                {isPlaying ? (
                    <Pause className="h-4 w-4 fill-current" />
                ) : (
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                )}
            </Button>

            <div className="flex flex-col flex-1 gap-1">
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
                />
                <div className="flex justify-between text-[10px] opacity-70 px-0.5 font-medium">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>
        </div>
    );
}