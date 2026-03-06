<?php

namespace App\Http\Controllers;

use App\Events\GetNotif;
use App\Events\GetUsers;
use App\Models\Chat;
use App\Models\Notification;
use App\Models\User;

use Illuminate\Http\Request;
use Inertia\Inertia;


class UserController extends Controller
{
    public function index(){
        $authUserId = auth()->id();
        $users = User::where('id', '!=', $authUserId)->get();
        $notifications =[];
        foreach ($users as $user) {
            $notificationsCount = Notification::where('senderId', $user->id)->where('receiverId', $authUserId)->where("status",false)->count();
            $notifications[$user->id] = $notificationsCount;
        }
        broadcast(new GetNotif($notifications,"chat.".$authUserId))->toOthers();
//        broadcast(new GetUsers($users,"chat.".$authUserId))->toOthers();

        return Inertia::render('Chat/Users', [
            "users" => $users,
            "user" => auth()->user(),
            "notifications" => $notifications,
        ]);
    }
}
