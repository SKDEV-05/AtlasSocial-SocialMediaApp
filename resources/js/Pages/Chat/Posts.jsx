import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { usePage, Head, router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import CreatePost from '@/Components/CreatePost';
import PostCard from '@/Components/PostCard';

export default function Posts({ posts: initialPosts }) {
    const { auth } = usePage().props;
    const [posts, setPosts] = useState(initialPosts);

    useEffect(() => {
        setPosts(initialPosts);
    }, [initialPosts]);

    useEffect(() => {
        const channel = window.Echo.private('posts')
            .listen('.add.post', (e) => {
                setPosts(prev => [e.post, ...prev]);
            })
            .listen('.post.updated', (e) => {
                setPosts(prev => prev.map(p => p.id === e.post.id ? { ...e.post, isLiked: p.isLiked } : p));
            });

        return () => {
            window.Echo.leave('posts');
        };
    }, []);

    return (
        <AuthenticatedLayout header="Feed">
            <Head title="Feed" />
            
            <div className="max-w-2xl mx-auto">
                <CreatePost />
                
                <div className="space-y-6">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                    
                    {posts.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No posts yet. Be the first to share something!</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
