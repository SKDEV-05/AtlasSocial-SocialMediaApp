import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';

// Icons
const VideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#059669" className="w-6 h-6">
        <path d="M10.46 13.06a1.53 1.53 0 0 0 0-2.12l-1.06-1.06a1.53 1.53 0 0 0-2.12 0l-1.06 1.06a1.53 1.53 0 0 0 0 2.12l1.06 1.06a1.53 1.53 0 0 0 2.12 0l1.06-1.06Z" />
        <path d="M4.93 1.07h14.14a3.86 3.86 0 0 1 3.86 3.86v14.14a3.86 3.86 0 0 1-3.86 3.86H4.93a3.86 3.86 0 0 1-3.86-3.86V4.93a3.86 3.86 0 0 1 3.86-3.86ZM19.07 15.2h-3.2v-1.6h3.2v-3.2h-3.2V8.8h3.2V5.6H15.2v3.2h-3.2V5.6H8.8v3.2H5.6v1.6h3.2v3.2H5.6v1.6h3.2v3.2h3.2v-3.2h3.2v3.2h3.86v-3.2ZM12 12a2.4 2.4 0 1 1-2.4-2.4A2.4 2.4 0 0 1 12 12Z" fill="currentColor"/>
       <path d="M17 10.5V7A1 1 0 0016 6H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
    </svg>
);

const PhotoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10b981" className="w-6 h-6">
        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
    </svg>
);

const FeelingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f59e0b" className="w-6 h-6">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a6.765 6.765 0 00-.16.316l-.004.01c-.027.06-.058.156-.109.32a.75.75 0 01-1.428-.445c.108-.346.196-.583.272-.746.155-.333.356-.66.702-.916C8.28 7.087 8.92 6.75 9.375 6.75s1.095.337 1.66 1.026a.75.75 0 11-1.17.948c-.287-.35-.558-.474-.49-.474zM14.625 6.75c.454 0 1.095.337 1.66 1.026a.75.75 0 11-1.17.948c-.287-.35-.558-.474-.49-.474-.54 0-.828.419-.936.634a6.765 6.765 0 00-.16.316l-.004.01c-.027.06-.058.156-.109.32a.75.75 0 01-1.428-.445c.108-.346.196-.583.272-.746.155-.333.356-.66.702-.916.592-.423 1.233-.76 1.688-.76zM15.75 12.75a.75.75 0 01.75.75c0 1.93-1.57 3.75-4.5 3.75S7.5 15.43 7.5 13.5a.75.75 0 011.5 0c0 1.002.928 2.25 3 2.25s3-1.248 3-2.25a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);

const LikeIcon = ({ liked }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${liked ? 'text-emerald-500' : 'text-gray-400'}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.247-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904" />
    </svg>
);

const CommentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.69 9-8.25s-4.03-8.25-9-8.25S3 7.44 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
    </svg>
);

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
    </svg>
);

// Create Post Component
const CreatePost = ({ user }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 p-5 mb-5 transition-all hover:shadow-md">
            <div className="flex gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex-shrink-0 overflow-hidden flex items-center justify-center text-emerald-700 font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <input
                    type="text"
                    placeholder={`What's on your mind, ${user?.name}?`}
                    className="flex-1 bg-gray-50 rounded-xl px-5 py-2.5 border border-gray-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 focus:bg-white transition-all outline-none text-gray-700 placeholder-gray-400 shadow-inner"
                />
            </div>
            <div className="border-t border-gray-50 pt-3 flex justify-around">
                <button className="flex items-center gap-2 hover:bg-emerald-50 px-4 py-2 rounded-xl transition-all group">
                    <VideoIcon />
                    <span className="text-gray-500 font-bold text-sm group-hover:text-emerald-600">Live</span>
                </button>
                <button className="flex items-center gap-2 hover:bg-emerald-50 px-4 py-2 rounded-xl transition-all group">
                    <PhotoIcon />
                    <span className="text-gray-500 font-bold text-sm group-hover:text-emerald-600">Photo</span>
                </button>
                <button className="flex items-center gap-2 hover:bg-emerald-50 px-4 py-2 rounded-xl transition-all group">
                    <FeelingIcon />
                    <span className="text-gray-500 font-bold text-sm group-hover:text-amber-600">Feeling</span>
                </button>
            </div>
        </div>
    );
}

// Single Post Component
const PostCard = ({ post }) => {
    const [liked, setLiked] = useState(false);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 mb-4 overflow-hidden transition-all hover:shadow-md">
            {/* Post Header */}
            <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex-shrink-0 cursor-pointer overflow-hidden ring-1 ring-emerald-100">
                    <img src={post.user.avatar} alt={post.user.name} className="w-full h-full object-cover" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 leading-tight cursor-pointer hover:text-emerald-600 transition-colors">{post.user.name}</h3>
                    <p className="text-emerald-500/60 text-[10px] font-black uppercase tracking-wider mt-0.5">{post.time}</p>
                </div>
                <button className="ml-auto text-gray-300 hover:text-gray-600 hover:bg-gray-50 p-2 rounded-lg transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                </button>
            </div>

            {/* Post Content */}
            <div className="px-5 pb-3">
                {post.content && <p className="text-gray-700 leading-relaxed font-medium">{post.content}</p>}
            </div>

            {post.image && (
                <div className="w-full bg-gray-50 border-y border-emerald-50/30">
                    <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-[500px]" />
                </div>
            )}

            {/* Post Stats */}
            <div className="px-5 py-3 flex items-center justify-between border-b border-gray-50">
               <div className="flex items-center gap-2">
                   <div className="bg-gradient-to-br from-emerald-400 to-green-600 rounded-full p-[3px] w-5 h-5 flex items-center justify-center shadow-sm">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.683a2.861 2.861 0 00-.48 1.964 2.893 2.893 0 01-1.286 2.373c-.703.468-1.234.93-1.234 1.313z"/></svg>
                   </div>
                   <span className="text-gray-400 text-sm font-bold hover:text-emerald-600 cursor-pointer transition-colors">{post.likes}</span>
               </div>
            </div>

            {/* Post Actions */}
            <div className="px-2 py-1.5 flex justify-between items-center">
                <button
                    onClick={() => setLiked(!liked)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all active:scale-95 ${liked ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <LikeIcon liked={liked} />
                    <span className="font-bold text-sm">Like</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-all active:scale-95">
                    <CommentIcon />
                    <span className="font-bold text-sm">Comment</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-all active:scale-95">
                    <ShareIcon />
                    <span className="font-bold text-sm">Share</span>
                </button>
            </div>
        </div>
    )
}

export default function Posts() {
    const user = usePage().props.auth.user;

    const mockPosts = [
        {
            id: 1,
            user: { name: 'Saad', avatar: 'https://i.pravatar.cc/150?u=saad' },
            time: '2 hours ago',
            content: 'Just finished a great coding session! 🚀 #laravel #react',
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1472&q=80',
            likes: 124
        },
        {
            id: 2,
            user: { name: 'Sarah Wilson', avatar: 'https://i.pravatar.cc/150?u=sarah' },
            time: '4 hours ago',
            content: 'Exploring the beauty of nature 🌿',
            image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
            likes: 89
        }
    ];

    return (
        <div className="max-w-2xl mx-auto py-8">
            <CreatePost user={user} />
            <div className="space-y-4">
                {mockPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}
