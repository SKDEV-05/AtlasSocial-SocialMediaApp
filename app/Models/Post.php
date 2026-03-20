<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory,softDeletes;
    protected $fillable = [
        "body","image","userId","likes"
    ];

    public function user(){
        return $this->belongsTo(User::class,"userId");
    }
    public function comments(){
        return $this->hasMany(Comment::class,"postId");
    }

    public function auditLogs(){
        return $this->hasMany(PostAuditLog::class);
    }
}
