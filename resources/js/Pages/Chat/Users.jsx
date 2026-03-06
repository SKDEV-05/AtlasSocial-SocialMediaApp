import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from "react";
import { Search, MessageSquare, Users as UsersIcon } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area";
import notifSong from "../../../assets/songs/notification.wav";

export default function Users({ users, user: currentUser, notifications }) {
    const [allUsers, setAllUsers] = useState(users.filter(u => u.id !== currentUser.id));
    const [allNotifications, setNotifications] = useState(notifications || {});
    const [searchQuery, setSearchQuery] = useState("");
    
    // Play sound on notification
    useEffect(() => {
        const notif = new Audio(notifSong);
        // We need a way to track new notifications to play sound, 
        // but for now we just keep the existing structure
    }, []);

    useEffect(() => {
        if (!currentUser?.id) return;
        
        window.Echo.private(`chat.${currentUser.id}`)
            .listen(".users.get", (e) => {
                if (e.users) setAllUsers(e.users);
            })
            .listen(".get.notif", (e) => {
                if (e.notifs) {
                    setNotifications(e.notifs);
                    new Audio(notifSong).play().catch(e => console.log("Audio play failed", e));
                }
            });

        return () => { window.Echo.leave(`chat.${currentUser.id}`); }
    }, [currentUser?.id]);

    const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalNotifs = Object.values(allNotifications).reduce((a, b) => a + (b || 0), 0);

    return (
        <AuthenticatedLayout header="Messages">
            <Head title="Messages" />

            <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)]">
                <Card className="h-full flex flex-col border-border/50 shadow-lg">
                    <CardHeader className="pb-4 border-b">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                    <MessageSquare className="h-6 w-6 text-primary" />
                                    Conversations
                                </CardTitle>
                                <CardDescription>
                                    Connect with your friends and colleagues
                                </CardDescription>
                            </div>
                            {totalNotifs > 0 && (
                                <Badge variant="destructive" className="px-3 py-1 text-sm animate-pulse">
                                    {totalNotifs} new messages
                                </Badge>
                            )}
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search people..." 
                                className="pl-9 bg-muted/50 border-muted-foreground/20"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 overflow-y-auto p-0">
                        {filteredUsers.length > 0 ? (
                            <div className="divide-y divide-border/50">
                                {filteredUsers.map((user) => {
                                    const unreadCount = allNotifications[user.id] || 0;
                                    return (
                                        <Link
                                            key={user.id}
                                            href={route("chat.index", { friendId: user.id })}
                                            className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                                        >
                                            <div className="relative">
                                                <Avatar className="h-12 w-12 border-2 border-background shadow-sm group-hover:scale-105 transition-transform">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                                                        {user.name}
                                                    </h3>
                                                    {unreadCount > 0 && (
                                                        <span className="text-xs font-medium text-primary whitespace-nowrap">
                                                            New message
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {unreadCount > 0 
                                                        ? <span className="font-medium text-foreground">Click to view messages</span> 
                                                        : "Start a conversation"}
                                                </p>
                                            </div>

                                            {unreadCount > 0 && (
                                                <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                                                    {unreadCount}
                                                </Badge>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-12 text-center text-muted-foreground">
                                <UsersIcon className="h-12 w-12 mb-4 opacity-20" />
                                <p>No users found matching "{searchQuery}"</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
