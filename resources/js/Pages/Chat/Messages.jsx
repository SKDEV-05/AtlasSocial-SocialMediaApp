import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send, Phone, Video, MoreVertical, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card } from "@/Components/ui/card";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { cn } from "@/lib/utils";
import audio from "../../../assets/songs/notification.wav";

export default function Messages({ user, messages, friend }) {
    const [allMessages, setAllMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const scrollAreaRef = useRef(null);

    useEffect(() => {
        setAllMessages(messages);
    }, [messages]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [allMessages]);

    useEffect(() => {
        if (!user?.id) return;
        const notif = new Audio(audio);
        
        window.Echo.private(`chat.${user.id}`)
            .listen(".chat.send", (e) => {
                // If message is from the friend we are currently chatting with
                if (e.message.senderId === friend.id) {
                    setAllMessages((prev) => [...prev, e.message]);
                    // Don't play sound if we are already in the conversation with them
                } else {
                    // Play sound for messages from OTHER users
                    notif.play().catch(e => console.log("Audio play failed", e));
                }
            })
            .error((error) => { console.error('Echo Subscription Error:', error); });

        return () => { window.Echo.leave(`chat.${user.id}`); };
    }, [user?.id, friend.id]);

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
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                            <Phone className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
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
                                        <p>{msg.message}</p>
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
                        <Input
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary min-h-[44px]"
                            autoFocus
                        />
                        <Button 
                            type="submit" 
                            size="icon" 
                            disabled={!messageInput.trim() || isSending}
                            className="h-11 w-11 rounded-full shadow-md shrink-0"
                        >
                            {isSending ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Send className="h-5 w-5 ml-0.5" />
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
