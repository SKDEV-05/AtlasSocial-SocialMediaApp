<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChatRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "senderId"=>"required|exists:users,id",
            "receiverId"=>"required|exists:users,id",
            "message"=>"nullable|string",
            "audio"=>"nullable|file|mimes:audio/mpeg,mpga,mp3,wav,aac,ogg,webm|max:10240", // 10MB max
        ];
    }
}
