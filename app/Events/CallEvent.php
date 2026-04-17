<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CallEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $caller;
    public $roomId;
    public $callType;
    public $receiverId;

    /**
     * Create a new event instance.
     */
    public function __construct($caller, $roomId, $callType, $receiverId)
    {
        $this->caller = $caller;
        $this->roomId = $roomId;
        $this->callType = $callType;
        $this->receiverId = $receiverId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('chat.' . $this->receiverId),
        ];
    }

    public function broadcastAs()
    {
        return 'incoming-call';
    }
}
