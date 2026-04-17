import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, MessageCircle, Users, Newspaper, Menu, X, Bell, Settings, LogOut, PlaySquare } from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { ThemeToggle } from '@/Components/ThemeToggle';
import Text from '@/Components/Text';
import {
    DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { cn } from '@/lib/utils';
import audio from "../../assets/songs/notification.wav";
import VideoCall from '@/Components/Call/VideoCall';
import CallNotification from '@/Components/Call/CallNotification';
import axios from 'axios';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { url } = usePage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [incomingCall, setIncomingCall] = useState(null);
    const [activeCall, setActiveCall] = useState(null);

    // Global Notification & Call Listener
    useEffect(() => {
        if (!user?.id) return;

        const notif = new Audio(audio);

        const channel = window.Echo.private(`chat.${user.id}`)
            .listen(".chat.send", (e) => {
                const params = new URLSearchParams(window.location.search);
                const currentFriendId = params.get('friendId');

                window.dispatchEvent(new CustomEvent('chat-message', { detail: e.message }));

                if (currentFriendId != e.message.senderId) {
                    notif.play().catch(err => console.error("Audio play failed", err));
                }
            })
            .listen(".incoming-call", (e) => {
                console.log("Incoming call:", e);
                setIncomingCall(e);
            });

        // Listen for internal call triggers from other components
        const handleStartCall = (event) => {
            const { receiverId, callType } = event.detail;
            const roomId = `room_${Math.min(user.id, receiverId)}_${Math.max(user.id, receiverId)}`;
            
            // Trigger call on background
            axios.post(route('chat.call'), {
                receiverId: receiverId,
                roomId: roomId,
                callType: callType
            }).catch(err => console.error("Failed to trigger call", err));

            setActiveCall({
                roomId: roomId,
                callType: callType,
                userId: user.id,
                userName: user.name
            });
        };

        window.addEventListener('start-call', handleStartCall);

        return () => {
            window.Echo.leave(`chat.${user.id}`);
            window.removeEventListener('start-call', handleStartCall);
        };
    }, [user?.id, user?.name]);

    const handleAcceptCall = () => {
        setActiveCall({
            roomId: incomingCall.roomId,
            callType: incomingCall.callType,
            userId: user.id,
            userName: user.name
        });
        setIncomingCall(null);
    };

    const handleDeclineCall = () => {
        setIncomingCall(null);
    };

    const navigation = [
        { name: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard, current: route().current('dashboard') },
        { name: 'Chat', href: route('out_conversation'), icon: MessageCircle, current: route().current('out_conversation') || url.startsWith('/chat') },
        { name: 'Feed', href: route('posts.index'), icon: Newspaper, current: route().current('posts.index') },
        { name: 'Videos', href: route('videos.index'), icon: PlaySquare, current: route().current('videos.index') },
        { name: 'People', href: route('out_conversation'), icon: Users, current: route().current('users') }, 
    ];

    if (user.isAdmin && route().has('admin.dashboard')) {
        navigation.push({ name: 'Admin', href: route('admin.dashboard'), icon: Settings, current: route().current('admin.dashboard') });
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r bg-card/50 backdrop-blur-xl fixed inset-y-0 z-50 h-full">
                <div className="p-6 flex items-center gap-2">
                    <ApplicationLogo className="h-10 w-10 object-contain" />
                    <Text className="font-bold text-xl tracking-tight">Atlas Social</Text>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                                item.current 
                                    ? "bg-primary text-primary-foreground shadow-md" 
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", item.current ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground")} />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t space-y-3">
    <div className="flex items-center justify-between">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="rounded-full relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full" />
        </Button>
    </div>

    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start px-2 py-2 h-auto hover:bg-accent/50">
                <div className="flex items-center gap-3 w-full">
                    <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left min-w-0 flex-1">
                        <p className="text-sm font-medium truncate leading-tight">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate leading-tight">{user.email}</p>
                    </div>
                    <Settings className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href={route('profile.edit')} className="cursor-pointer w-full flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href={route('logout')} method="post" as="button" className="cursor-pointer w-full flex items-center text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </Link>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ApplicationLogo className="h-10 w-10 object-contain" />
                    <Text className="font-bold text-lg">Atlas Social</Text>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Link href={route('profile.edit')}>
                         <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 pb-16 md:pb-0 overflow-y-auto min-h-screen">
                <div className="mx-auto max-w-7xl p-4 md:p-8 animate-in fade-in duration-500">
                    {header && (
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">{header}</h1>
                        </header>
                    )}
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t pb-safe">
                <div className="flex h-16 justify-around items-center">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 transition-colors",
                                item.current 
                                    ? "text-primary" 
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("h-6 w-6", item.current && "fill-current/20")} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    ))}
                </div>
            </nav>

            {incomingCall && (
                <CallNotification 
                    caller={incomingCall.caller} 
                    callType={incomingCall.callType}
                    onAccept={handleAcceptCall}
                    onDecline={handleDeclineCall}
                />
            )}

            {activeCall && (
                <VideoCall 
                    roomId={activeCall.roomId}
                    userId={activeCall.userId}
                    userName={activeCall.userName}
                    callType={activeCall.callType}
                    onClose={() => setActiveCall(null)}
                />
            )}
        </div>
    );
}
