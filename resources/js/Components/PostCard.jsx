import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/ui/card';
import { Separator } from '@/Components/ui/separator';
import { Input } from '@/Components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { cn } from '@/lib/utils';

export default function PostCard({ post }) {
    const { auth } = usePage().props;
    // Use optional chaining and default values to prevent crashes
    const [isLiked, setIsLiked] = useState(post?.isLiked || false); 
    const [likesCount, setLikesCount] = useState(post?.likes || 0);
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState(post?.comments || []);

    // Update local state when prop changes (e.g., after a re-fetch)
    React.useEffect(() => {
        setIsLiked(post?.isLiked || false);
        setLikesCount(post?.likes || 0);
        setComments(post?.comments || []);
    }, [post]);

    const handleLike = () => {
        const wasLiked = isLiked;
        setIsLiked(!wasLiked);
        setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);
        
        const routeName = wasLiked ? 'posts.unlike' : 'posts.like';
        
        router.post(route(routeName), {
            postId: post.id,
            userId: auth.user.id
        }, {
            preserveScroll: true,
            onError: () => {
                // Revert optimistic update on error
                setIsLiked(wasLiked);
                setLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
            }
        });
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        router.post(route('posts.create_comment'), { 
            postId: post.id,
            body: comment,
            userId: auth.user.id
        }, {
            preserveScroll: true,
            onSuccess: (page) => {
                setComment("");
                // In a real app, we'd update the comments list from the response
                // For now, we rely on Inertia's reload or manual state update if we had the new comment
            }
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="mb-6 overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Report</DropdownMenuItem>
                            {auth.user.id === post.user.id && (
                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                
                <CardContent className="p-4 pt-2">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap mb-4">{post.body}</p>
                    {post.image && (
                        <div className="rounded-lg overflow-hidden border bg-muted/30">
                            <img 
                                src={`/storage/${post.image}`} 
                                alt="Post content" 
                                className="w-full h-auto max-h-[500px] object-contain"
                                loading="lazy"
                            />
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col p-0">
                    <div className="flex items-center justify-between w-full px-4 py-2 border-t bg-muted/10">
                        <div className="flex items-center gap-1">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className={cn("gap-2 hover:text-red-500", isLiked && "text-red-500")}
                                onClick={handleLike}
                            >
                                <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                                <span className="text-xs">{likesCount}</span>
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="gap-2"
                                onClick={() => setShowComments(!showComments)}
                            >
                                <MessageCircle className="h-4 w-4" />
                                <span className="text-xs">{comments.length}</span>
                            </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>

                    <AnimatePresence>
                        {showComments && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="w-full border-t bg-muted/20"
                            >
                                <div className="p-4 space-y-4">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className="flex gap-3 text-sm">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user.name}`} />
                                                <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 bg-background p-3 rounded-lg border shadow-sm">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-semibold text-xs">{comment.user.name}</span>
                                                    <span className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(comment.created_at))} ago</span>
                                                </div>
                                                <p className="text-muted-foreground">{comment.body}</p>
                                            </div>
                                        </div>
                                    ))}

                                    <form onSubmit={handleCommentSubmit} className="flex gap-2 items-center mt-4">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.user.name}`} />
                                            <AvatarFallback>{auth.user.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 relative">
                                            <Input 
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Write a comment..." 
                                                className="pr-10"
                                            />
                                            <Button 
                                                type="submit" 
                                                size="icon" 
                                                variant="ghost" 
                                                className="absolute right-0 top-0 h-full w-10 text-primary hover:text-primary/80"
                                                disabled={!comment.trim()}
                                            >
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
