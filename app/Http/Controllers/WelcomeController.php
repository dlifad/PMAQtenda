<?php

namespace App\Http\Controllers;

use App\Models\Tenda;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    /**
     * Display the welcome page
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        if (Auth::check()) {
            $user = Auth::user();
            if ($user->role === 'pengelola') {
                return redirect()->route('pengelola.dashboard');
            } elseif ($user->role === 'petugas_lapangan') {
                return redirect()->route('petugas.dashboard');
            }
        }

        $tendas = Tenda::all()->map(function ($tenda) {
            return [
                'id_tenda' => $tenda->id_tenda,
                'nama_tenda' => $tenda->nama_tenda,
                'deskripsi' => $tenda->deskripsi,
                'isi_paket' => $tenda->isi_paket,
                'jumlah' => $tenda->jumlah,
                'harga' => $tenda->harga,
                'gambar_url' => $tenda->gambar ? Storage::url($tenda->gambar) : null,
            ];
        });

        return Inertia::render('Welcome', [
            'tendas' => $tendas,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }
}
