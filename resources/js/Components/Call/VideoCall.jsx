import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { X } from 'lucide-react';
import { Button } from '@/Components/ui/button';

const VideoCall = ({ roomId, userId, userName, onClose, callType = 'video' }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const appId = parseInt(import.meta.env.VITE_ZEGO_APP_ID);
        const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

        if (!appId || !serverSecret) {
            console.error("ZegoCloud AppID or ServerSecret is missing");
            return;
        }

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appId,
            serverSecret,
            roomId,
            userId.toString(),
            userName
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
            container: containerRef.current,
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
            showScreenSharingButton: true,
            turnOnCameraWhenJoining: callType === 'video',
            turnOnMicrophoneWhenJoining: true,
            onLeaveRoom: () => {
                onClose();
            },
        });

        return () => {
            if (zp) {
                zp.destroy();
            }
        };
    }, [roomId, userId, userName, callType]);

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center anime-in fade-in duration-300">
            <div className="absolute top-4 right-4 z-[110]">
                <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={onClose}
                    className="rounded-full shadow-lg hover:rotate-90 transition-transform duration-200"
                >
                    <X className="h-6 w-6" />
                </Button>
            </div>
            
            <div 
                ref={containerRef} 
                className="w-full h-full flex items-center justify-center p-4"
                style={{ width: '100vw', height: '100vh' }}
            />
            
            {!import.meta.env.VITE_ZEGO_APP_ID && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm p-6 text-center">
                    <div className="max-w-md space-y-4">
                        <h3 className="text-xl font-bold text-destructive">Configuration Requise</h3>
                        <p className="text-muted-foreground">
                            Veuillez configurer ! <code className="bg-muted p-1 rounded">VITE_ZEGO_APP_ID</code> et 
                            <code className="bg-muted p-1 rounded ml-1">VITE_ZEGO_SERVER_SECRET</code> dans votre fichier .env pour activer les appels.
                        </p>
                        <Button onClick={onClose}>Fermer</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoCall;
