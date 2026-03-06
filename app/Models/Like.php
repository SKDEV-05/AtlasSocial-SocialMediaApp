<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    use HasFactory;
    protected $fillable = ['userId', 'postId'];
    public static function isLiked($post,$user){
        return self::where(["postId"=>$post->id,"userId"=>$user->id])->exists();
    }
}
