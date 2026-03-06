<?php

namespace App\Http\Controllers;

use App\Events\GetNotif;
use App\Events\GetUsers;
use App\Events\SendMessage;
use App\Http\Requests\ChatRequest;
use App\Models\Chat;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use function Symfony\Component\Translation\t;

class ChatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $userId = auth()->id();
        $user = User::findOrFail($userId);

        $friendId = (int)request('friendId');

        $friend = User::findOrFail($friendId);
        $user->fill(["activeConversation"=>$friendId])->save();

        // Mark all messages from the friend to the user as read
        Chat::where('senderId', $friendId)
            ->where('receiverId', $userId)
            ->where('status', false)
            ->update(['status' => true]);

        broadcast(new GetUsers($friend, 'chat.'.$userId))->toOthers();

        $messages = Chat::where(function($query) use ($userId, $friendId) {
            $query->where("senderId", $userId)->where("receiverId", $friendId);
        })->orWhere(function($query) use ($userId, $friendId) {
            $query->where("senderId", $friendId)->where("receiverId", $userId);
        })->orderBy('created_at')->get();
        foreach ($messages as $message) {
            if($message->senderId == $friendId && $message->receiverId == $userId){
                $message->fill(["status" => true]);
                $message->save();

            }
        }
        $notifications = Notification::where("receiverId", $userId)->where("senderId", $friendId)->get();
        foreach ($notifications as $notification) {
            $notification->fill(["status" => true])->save();
        }
        return Inertia::render('Chat/Messages', [
            'messages' => $messages,
            'friend' => $friend,
            'user' => $user
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ChatRequest $request)
    {

        $messageData = $request->validated();
        $message = Chat::create($messageData);
        $receiverId = $message->receiverId;
        $senderId = $message->senderId;


            broadcast(new SendMessage($message))->toOthers();




        $sender = User::find($senderId);
//        $sender->fill(["notificationsCount"=>Notification::where("senderId", $senderId)
//            ->where("receiverId", $receiverId)
//            ->where("status", false)
//            ->count()])->save();

        $users = User::where('id', '!=', $receiverId)->get();
        $receiver = User::find($message->receiverId);
            if($receiver->activeConversation===$message->senderId){
                Notification::create([
                    "senderId" => $senderId,
                    "receiverId" => $receiverId,
                    "status" => true,
                ]);
            }else {
                Notification::create([
                    "senderId" => $senderId,
                    "receiverId" => $receiverId,
                ]);

            }





        $notifications =[];
        foreach ($users as $user) {
            $notificationsCount = Notification::where('senderId', $user->id)->where('receiverId', $receiverId)->where("status",false)->count();
            $notifications[$user->id] = $notificationsCount;
        }

        broadcast(new GetNotif($notifications,"chat.".$receiverId))->toOthers();

//        broadcast(new GetUsers($users,"chat.".$receiverId))->toOthers();

        return redirect()->back();
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
    public function out_conversation(){
        auth()->user()->fill(["activeConversation" => null])->save();
        return to_route('users.index');
    }
}
