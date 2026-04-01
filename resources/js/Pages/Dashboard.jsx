import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { ScrollArea, ScrollBar } from "@/Components/ui/scroll-area";
import { Badge } from "@/Components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { 
    Users, 
    MessageCircle, 
    ArrowRight, 
    Sparkles, 
    Activity,
    Plus,
    TrendingUp
} from 'lucide-react';

export default function Dashboard({ auth, users = [], posts = [] }) {
    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <AuthenticatedLayout header="Home">
            <Head title="Home" />

            <div className="space-y-8">
                {/* Hero Section */}
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/90 to-primary text-primary-foreground shadow-xl">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
                        <div className="space-y-4 max-w-2xl">
                            <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-md border border-white/20">
                                <Sparkles className="mr-2 h-4 w-4 text-yellow-300" />
                                <span>Welcome back to Twasel</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                                {greeting()}, {auth.user.name}!
                            </h1>
                            <p className="text-lg text-primary-foreground/80 leading-relaxed">
                                Connect with friends, share your moments, and explore what's happening around you.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-2">
                                <Button size="lg" variant="secondary" asChild className="font-semibold shadow-lg hover:shadow-xl transition-all">
                                    <Link href={route('posts.index')}>
                                        Explore Feed
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-white/10 hover:text-white" asChild>
                                    <Link href={route('out_conversation')}>
                                        Start Chatting
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <img 
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.user.name}&backgroundColor=transparent`} 
                                alt="Profile" 
                                className="h-64 w-64 drop-shadow-2xl animate-float"
                            />
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Suggested Connections (The "Avis" of users) */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                        <Users className="h-6 w-6 text-primary" />
                                        Suggested Connections
                                    </h2>
                                    <p className="text-muted-foreground">People you might want to connect with</p>
                                </div>
                                <Button variant="ghost" asChild>
                                    <Link href={route('out_conversation')} className="text-primary hover:text-primary/80">
                                        View All <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                            
                            <ScrollArea className="w-full whitespace-nowrap rounded-xl border bg-card shadow-sm">
                                <div className="flex w-max space-x-4 p-4">
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <div key={user.id} className="w-[180px] space-y-3 p-4 rounded-xl border bg-background/50 hover:bg-accent/50 transition-colors flex flex-col items-center text-center group">
                                                <div className="relative">
                                                    <Avatar className="h-20 w-20 border-2 border-background shadow-md group-hover:scale-105 transition-transform">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 ring-2 ring-background" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold text-sm truncate w-full max-w-[150px]" title={user.name}>{user.name}</h3>
                                                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user.email}</p>
                                                </div>
                                                <Button size="sm" className="w-full rounded-full" asChild>
                                                    <Link href={route('chat.index', { friendId: user.id })}>
                                                        <MessageCircle className="mr-2 h-3 w-3" />
                                                        Chat
                                                    </Link>
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex items-center justify-center w-full p-8 text-muted-foreground">
                                            No suggestions available right now.
                                        </div>
                                    )}
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </section>

                        {/* Recent Activity / Feed Snippet */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                        <Activity className="h-6 w-6 text-primary" />
                                        Latest Activity
                                    </h2>
                                    <p className="text-muted-foreground">What's happening in your network</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {posts.length > 0 ? (
                                    posts.map((post) => (
                                        <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                            <CardHeader className="flex flex-row items-center gap-4 p-4 pb-2 space-y-0">
                                                <Avatar>
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.name}`} />
                                                    <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-semibold">{post.user.name}</h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                                                    </p>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-2">
                                                <p className="text-sm line-clamp-2">{post.body}</p>
                                                {post.image && (
                                                    <div className="mt-2 rounded-md overflow-hidden h-32 bg-muted">
                                                        <img src={`/storage/${post.image}`} className="w-full h-full object-cover" alt="Post" />
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <Card className="bg-muted/30 border-dashed">
                                        <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                            <Activity className="h-10 w-10 mb-4 opacity-20" />
                                            <p>No recent activity to show.</p>
                                            <Button variant="link" asChild className="mt-2">
                                                <Link href={route('posts.index')}>Be the first to post!</Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Stats */}
                    <div className="space-y-8">
                        <Card className="bg-gradient-to-br from-card to-accent/20 border-border/50 shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-green-500" />
                                    Quick Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-2xl font-bold">{users.length}</p>
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Active Users</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-2xl font-bold">{posts.length}</p>
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">New Posts</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button className="w-full justify-start" asChild>
                                    <Link href={route('posts.index')}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create New Post
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link href={route('profile.edit')}>
                                        Edit Profile
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                        
                        <div className="rounded-xl bg-muted/30 p-4 border border-border/50">
                            <h3 className="font-semibold text-sm mb-2">Did you know?</h3>
                            <p className="text-xs text-muted-foreground">
                                You can customize your experience by toggling between light and dark mode in the sidebar settings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
