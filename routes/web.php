<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use function Pest\Laravel\get;

use App\Models\User;
use App\Models\Post;

Route::get('/', function () {
return auth()->check() ? redirect()->route('dashboard') : redirect()->route('login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'users' => User::where('id', '!=', auth()->id())->limit(5)->get(),
        'posts' => Post::with('user')->latest()->limit(3)->get()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
//Route::middleware(["auth", "verified"])->group(function () {
//    Route:get("/messages/{friendId}",[ChatController::class, 'getMessages']);
//});
//Route::middleware(["auth", "verified"])->group(function () {
//    Route::get("/users",[])
//})
Route::middleware(["auth", "verified"])->group(function () {
    Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');
    Route::post('/chat', [ChatController::class, 'store'])->name('chat.store');
    Route::get("/out_conversation",[ChatController::class,'out_conversation'])->name('out_conversation');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get("/users",[UserController::class, 'index'])->name('users.index');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get("/posts",[PostController::class, 'index'])->name('posts.index');
    Route::post("/posts",[PostController::class, 'store'])->name('posts.store');
    Route::post("/posts/like",[PostController::class, 'likePost'])->name('posts.like');
    Route::post("posts/dislike",[PostController::class, 'unlikePost'])->name('posts.unlike');
    Route::post("posts/comment",[PostController::class, 'addComment'])->name('posts.create_comment');
    Route::get("posts/comment/{post}",[PostController::class, 'getComments'])->name('posts.get_comments');
    Route::get('/design-system', function () {
        return Inertia::render('DesignSystem');
    })->name('design-system');
});
require __DIR__.'/auth.php';
