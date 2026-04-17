import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send, Phone, Video, MoreVertical, Loader2, Mic, Square, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card } from "@/Components/ui/card";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { cn } from "@/lib/utils";
import audio from "../../../assets/songs/notification.wav";
import AudioPlayer from "@/Components/AudioPlayer";

export default function Messages({ user, messages, friend }) {
    const [allMessages, setAllMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const messagesEndRef = useRef(null);
    const scrollAreaRef = useRef(null);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const isCancelledRef = useRef(false);

    useEffect(() => {
        setAllMessages(messages);
    }, [messages]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [allMessages]);

    useEffect(() => {
        const handleMessage = (event) => {
            const message = event.detail;
            if (message.senderId === friend.id) {
                setAllMessages((prev) => [...prev, message]);
            }
        };

        window.addEventListener('chat-message', handleMessage);

        return () => {
            window.removeEventListener('chat-message', handleMessage);
        };
    }, [friend.id]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Setup Audio Context for Visualizer
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 256;
            
            audioContextRef.current = audioContext;
            analyserRef.current = analyser;
            
            // Setup Media Recorder
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];
            isCancelledRef.current = false;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                // Stop visualizer
                if (animationRef.current) cancelAnimationFrame(animationRef.current);
                if (audioContextRef.current) audioContextRef.current.close();

                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => track.stop());

                if (!isCancelledRef.current) {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    // Only send if we have data (avoid empty files)
                    if (audioBlob.size > 0) {
                        const audioFile = new File([audioBlob], "voice_message.webm", { type: 'audio/webm' });
                        sendAudioMessage(audioFile);
                    }
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
            drawVisualizer();
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Could not access microphone. Please ensure permissions are granted.");
        }
    };

    const drawVisualizer = () => {
        if (!canvasRef.current || !analyserRef.current) return;

        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext("2d");
        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            canvasCtx.fillStyle = 'rgb(255, 255, 255)'; // Clear with background color (or transparent)
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;

                // Create gradient or color based on volume
                canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
                canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };

        draw();
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };
    
    const cancelRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            isCancelledRef.current = true;
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const sendAudioMessage = (audioFile) => {
        setIsSending(true);
        
        const formData = new FormData();
        formData.append("senderId", user.id);
        formData.append("receiverId", friend.id);
        formData.append("audio", audioFile);

        // Optimistic update (placeholder)
        const tempId = Date.now();
        const optimisticMessage = { 
            id: tempId, 
            senderId: user.id, 
            receiverId: friend.id, 
            message: null,
            audio_path: URL.createObjectURL(audioFile), // Temporary blob URL
            created_at: new Date().toISOString() 
        };
        
        setAllMessages(prev => [...prev, optimisticMessage]);

        router.post(route("chat.store"), formData, {
            onSuccess: () => {
                setIsSending(false);
            },
            onError: () => {
                setIsSending(false);
                setAllMessages(prev => prev.filter(m => m.id !== tempId));
            },
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || isSending) return;

        setIsSending(true);
        const newMessage = {
            senderId: user.id,
            receiverId: friend.id,
            message: messageInput
        };

        // Optimistic update
        const tempId = Date.now();
        const optimisticMessage = { ...newMessage, id: tempId, created_at: new Date().toISOString() };
        setAllMessages(prev => [...prev, optimisticMessage]);
        setMessageInput("");

        router.post(route("chat.store"), newMessage, {
            onSuccess: () => {
                setIsSending(false);
            },
            onError: () => {
                setIsSending(false);
                // Remove optimistic message on error or show error state
                setAllMessages(prev => prev.filter(m => m.id !== tempId));
            },
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout header={null}>
            <Head title={`Chat with ${friend.name}`} />

            <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl border bg-background">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b bg-card z-10">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.name}`} />
                            <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="font-semibold leading-none">{friend.name}</h2>
                            <span className="text-xs text-green-500 font-medium flex items-center gap-1 mt-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                Online
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-primary"
                            onClick={() => window.dispatchEvent(new CustomEvent('start-call', { detail: { receiverId: friend.id, callType: 'audio' } }))}
                        >
                            <Phone className="h-5 w-5" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-primary"
                            onClick={() => window.dispatchEvent(new CustomEvent('start-call', { detail: { receiverId: friend.id, callType: 'video' } }))}
                        >
                            <Video className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 bg-muted/30 space-y-4 scroll-smooth">
                    {allMessages.map((msg, index) => {
                        const isMe = msg.senderId === user.id;
                        return (
                            <div
                                key={msg.id || index}
                                className={cn(
                                    "flex w-full",
                                    isMe ? "justify-end" : "justify-start"
                                )}
                            >
                                <div className={cn(
                                    "flex max-w-[80%] md:max-w-[60%] gap-2",
                                    isMe ? "flex-row-reverse" : "flex-row"
                                )}>
                                    {!isMe && (
                                        <Avatar className="h-8 w-8 mt-1 border border-background shadow-sm">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.name}`} />
                                            <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    )}

                                    <div className={cn(
                                        "p-3 rounded-2xl text-sm shadow-sm",
                                        isMe
                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                            : "bg-card text-card-foreground border rounded-bl-none"
                                    )}>
                                        {msg.audio_path ? (
                                            <AudioPlayer src={msg.audio_path} className={isMe ? "text-primary-foreground" : ""} />
                                        ) : (
                                            <p>{msg.message}</p>
                                        )}
                                        <p className={cn(
                                            "text-[10px] mt-1 opacity-70 text-right",
                                            isMe ? "text-primary-foreground" : "text-muted-foreground"
                                        )}>
                                            {new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-card border-t">
                    <form onSubmit={sendMessage} className="flex items-end gap-2">
                        {isRecording ? (
                            <div className="flex-1 flex items-center gap-2 bg-muted/50 rounded-md px-3 h-[44px] border border-red-200 animate-in fade-in duration-300">
                                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                                <span className="text-xs font-medium text-red-500 w-12">Rec</span>
                                <canvas 
                                    ref={canvasRef} 
                                    className="flex-1 h-8 w-full"
                                    width={300}
                                    height={50}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={cancelRecording}
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <Input
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary min-h-[44px]"
                                autoFocus
                            />
                        )}
                        
                        {messageInput.trim() ? (
                            <Button
                                type="submit"
                                size="icon"
                                disabled={isSending}
                                className="h-11 w-11 rounded-full shadow-md shrink-0"
                            >
                                {isSending ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Send className="h-5 w-5 ml-0.5" />
                                )}
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                size="icon"
                                onClick={isRecording ? stopRecording : startRecording}
                                className={cn(
                                    "h-11 w-11 rounded-full shadow-md shrink-0 transition-all duration-300",
                                    isRecording ? "bg-red-500 hover:bg-red-600" : ""
                                )}
                            >
                                {isRecording ? (
                                    <Send className="h-5 w-5 fill-current" />
                                ) : (
                                    <Mic className="h-5 w-5" />
                                )}
                            </Button>
                        )}
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}