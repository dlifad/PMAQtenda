<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Buat user pengelola
        User::create([
            'name' => 'Admin Pengelola',
            'email' => 'pengelola@pmaqtenda.com',
            'password' => Hash::make('password123'),
            'role' => 'pengelola',
            'email_verified_at' => now(),
        ]);

        // Buat user petugas lapangan
        User::create([
            'name' => 'Petugas Lapangan 1',
            'email' => 'petugas1@pmaqtenda.com',
            'password' => Hash::make('password123'),
            'role' => 'petugas_lapangan',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Petugas Lapangan 2',
            'email' => 'petugas2@pmaqtenda.com',
            'password' => Hash::make('password123'),
            'role' => 'petugas_lapangan',
            'email_verified_at' => now(),
        ]);
    }
}
