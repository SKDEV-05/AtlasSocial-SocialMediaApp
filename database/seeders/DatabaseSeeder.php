<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        User::create([
            "name"=>"Abdelaziz aabbour Admin",
            "email"=>"admin@gmail.com",
            'email_verified_at' => now(),
            "password"=>bcrypt("12345678"),
            'remember_token' => Str::random(10),
            'isAdmin' => true,
        ]);
        // User::factory()->count(4)->create();

    }
}
