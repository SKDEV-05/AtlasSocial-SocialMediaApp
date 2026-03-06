import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { usePage, Head } from '@inertiajs/react';
import React from 'react';
import CreatePost from '@/Components/CreatePost';
import PostCard from '@/Components/PostCard';

export default function Posts({ posts }) {
    const { auth } = usePage().props;

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
