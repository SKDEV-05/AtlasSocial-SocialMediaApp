import React, { useEffect, useState } from 'react';
import { Phone, PhoneOff, Video, X } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Card } from "@/Components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';

const CallNotification = ({ caller, callType, onAccept, onDecline }) => {
    useEffect(() => {
        const ringtone = new Audio('https://assets.mixkit.co/active_storage/sfx/1359/1359-preview.mp3'); // Fallback online ringtone
        ringtone.loop = true;
        
        const playRingtone = async () => {
            try {
                await ringtone.play();
            } catch (err) {
                console.log("Ringtone playback requires user interaction");
            }
        };

        playRingtone();
        
        return () => {
            ringtone.pause();
            ringtone.currentTime = 0;
        };
    }, []);

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-full max-w-sm px-4"
            >
                <Card className="bg-card/95 backdrop-blur-md border shadow-2xl p-4 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                    
                    <div className="relative flex items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-14 w-14 border-2 border-primary/20 shadow-inner">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${caller.name}`} />
                                <AvatarFallback>{caller.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-background animate-pulse" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg truncate">{caller.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5 capitalize">
                                {callType === 'video' ? <Video className="h-3.5 w-3.5" /> : <Phone className="h-3.5 w-3.5" />}
                                Appel {callType === 'video' ? 'Vidéo' : 'Audio'} entrant...
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-3">
                        <Button 
                            variant="destructive" 
                            className="flex-1 gap-2 rounded-xl h-12 shadow-lg shadow-red-500/20"
                            onClick={onDecline}
                        >
                            <PhoneOff className="h-4 w-4" />
                            Refuser
                        </Button>
                        <Button 
                            variant="default" 
                            className="flex-1 gap-2 rounded-xl h-12 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20"
                            onClick={onAccept}
                        >
                            {callType === 'video' ? <Video className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                            Répondre
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
};

export default CallNotification;
