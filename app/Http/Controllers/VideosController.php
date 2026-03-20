<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Illuminate\Routing\Attributes\Controllers\Middleware;

#[Middleware("auth")]
class VideosController extends Controller
{
    public function index(){
        $response = Http::withHeaders([
            "Authorization" => env("PEXELS_API_KEY"),
        ])->get("https://api.pexels.com/videos/popular");

        return Inertia::render('Chat/Videos', [
            'videos' => $response->json()['videos'] ?? []
        ]);
    }
}
