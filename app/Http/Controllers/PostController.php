<?php

namespace App\Http\Controllers;


use App\Events\AddPost;
use App\Http\Requests\CommentRequest;
use App\Http\Requests\LikeRequest;
use App\Http\Requests\PostRequest;
use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::with('user')->latest()->get();
        $postsPayload = $posts->map(function($post){
            $post->load('comments.user');
            $p = $post->toArray();
            $p['isLiked'] = Like::isLiked($post, auth()->user());
            return $p;
        });

        return Inertia::render('Chat/Posts',['posts'=>$postsPayload,"user"=>auth()->user()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PostRequest $request)
    {

        $postData = $request->validated();

        $this->addFile($request,$postData);
        Post::create($postData);
        $post = Post::with('user')->latest()->first();
        $post->load('comments.user');
        // Broadcast to all listeners including the creator so the owner
        // sees the new post without needing to refresh.
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function addFile(PostRequest $request , &$postdata){
        if($request->hasFile('image')){
            $postdata['image'] = $request->file('image')->store('posts', 'public');
        }
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
        
        return redirect()->back();
    }

    public function unlikePost(LikeRequest $request){
        $userId = auth()->id();
        $like = Like::where("postId",$request->postId)->where("userId",$userId)->first();
        
        if($like){
            $like->delete();
            $post = Post::where("id",$request->postId)->first();
            // Prevent negative likes
            $newLikes = max(0, $post->likes - 1);
            $post->fill(["likes"=>$newLikes])->save();
        }
        return redirect()->back();
    }

    public function addComment(CommentRequest $request){
        $commentpost = $request->validated();
        Comment::create($commentpost);
        return redirect()->back();
    }



}
