<?php

namespace App\Http\Controllers;

use App\Models\Tenda;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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

        $tendas = Tenda::all();

        return Inertia::render('Welcome', [
            'tendas' => $tendas
        ]);
    }
}