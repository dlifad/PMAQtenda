<?php

namespace App\Http\Controllers;

use App\Models\Tenda;
use Illuminate\Http\Request;
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
        $tendas = Tenda::all();

        return Inertia::render('Welcome', [
            'tendas' => $tendas
        ]);
    }
}