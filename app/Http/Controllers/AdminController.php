<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $totalPosts = Post::count();
        $totalMessages = Chat::count();

        // Get recent posts with user info for management
        // Pagination could be added here if there are many posts
        $posts = Post::with('user')->latest()->get()->map(function ($post) {
            return [
                'id' => $post->id,
                'body' => $post->body,
                'image' => $post->image,
                'created_at' => $post->created_at,
                'user' => [
                    'id' => $post->user->id,
                    'name' => $post->user->name,
                    'email' => $post->user->email,
                ],
                'likes_count' => $post->likes,
            ];
        });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'users' => $totalUsers,
                'posts' => $totalPosts,
                'messages' => $totalMessages,
            ],
            'posts' => $posts,
        ]);
    }

    public function deletePost($id)
    {
        $post = Post::findOrFail($id);
        $post->delete();

        return redirect()->back()->with('success', 'Post deleted successfully.');
    }
}
