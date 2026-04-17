<?php

namespace App\Http\Controllers;


use App\Events\AddPost;
use App\Events\PostUpdated;
use App\Http\Requests\CommentRequest;
use App\Http\Requests\LikeRequest;
use App\Http\Requests\PostRequest;
use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;
use App\Models\PostAuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $posts = Post::with('user')->latest()->get();
        $postsPayload = $posts->map(function($post) use ($user) {
            $post->load('comments.user');
            $p = $post->toArray();
            $p['isLiked'] = Like::isLiked($post, $user);
            $p['can'] = [
                'update' => $user ? Gate::allows('update', $post) : false,
                'delete' => $user ? Gate::allows('delete', $post) : false,
            ];
            return $p;
        });

        return Inertia::render('Chat/Posts',['posts'=>$postsPayload,"user"=>$user]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PostRequest $request)
    {
        $postData = $request->validated();
        // Additional manual check if needed, but usually handled by Request or Policy
        
        if($request->hasFile('image')){
            $postData['image'] = $request->file('image')->store('posts', 'public');
        }
        
        $post = Post::create($postData);
        
        // Audit Log Creation
        PostAuditLog::create([
            'post_id' => $post->id,
            'user_id' => auth()->id(),
            'action' => 'created',
            'new_values' => $post->toArray(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        $post->load('user', 'comments.user');
        
        broadcast(new AddPost($post));
        return to_route("posts.index");
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $post = Post::findOrFail($id);
        
        if (!Gate::allows('update', $post)) {
            abort(403);
        }

        $validated = $request->validate([
            'body' => 'required|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $oldValues = $post->toArray();
        $updateData = ['body' => $validated['body']];

        if ($request->hasFile('image')) {
            if ($post->image) {
                Storage::disk('public')->delete($post->image);
            }
            $updateData['image'] = $request->file('image')->store('posts', 'public');
        }

        $post->update($updateData);

        // Audit Log Update
        PostAuditLog::create([
            'post_id' => $post->id,
            'user_id' => auth()->id(),
            'action' => 'updated',
            'old_values' => $oldValues,
            'new_values' => $post->fresh()->toArray(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $post = Post::findOrFail($id);
        
        if (!Gate::allows('delete', $post)) {
            abort(403);
        }

        $oldValues = $post->toArray();
        
        // Audit Log Deletion (before deleting record if using soft deletes, or store what was deleted)
        PostAuditLog::create([
            'post_id' => $post->id,
            'user_id' => auth()->id(),
            'action' => 'deleted',
            'old_values' => $oldValues,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        if ($post->image) {
            Storage::disk('public')->delete($post->image);
        }

        $post->delete();

        return redirect()->back();
    }

    public function likePost(LikeRequest $request){
        $post = Post::findOrFail($request->postId);
        $userId = auth()->id();
        
        // Prevent duplicate likes
        $existingLike = Like::where('postId', $post->id)->where('userId', $userId)->first();
        if ($existingLike) {
            return redirect()->back();
        }

        $post->fill(["likes"=>$post->likes+1])->save();
        
        Like::create([
            'postId' => $post->id,
            'userId' => $userId
        ]);

        $post->load('user', 'comments.user');
        broadcast(new PostUpdated($post));
        
        return redirect()->back();
    }

    public function unlikePost(Request $request){
         $post = Post::findOrFail($request->postId);
         $userId = auth()->id();

         $existingLike = Like::where('postId', $post->id)->where('userId', $userId)->first();
         
         if($existingLike){
             $existingLike->delete();
             $post->fill(["likes"=>max(0, $post->likes-1)])->save();
             
             $post->load('user', 'comments.user');
             broadcast(new PostUpdated($post));
         }
         
         return redirect()->back();
    }

    public function addComment(CommentRequest $request){
        $data = $request->validated();
        $comment = Comment::create($data);
        
        $post = Post::findOrFail($data['postId']);
        $post->load('user', 'comments.user');
        broadcast(new PostUpdated($post));

        return redirect()->back();
    }

    public function getComments(Post $post){
        return response()->json($post->comments()->with('user')->latest()->get());
    }
}
