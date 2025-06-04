<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\PenyewaanController;
use App\Http\Controllers\LupaIdController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Pengelola\DashboardController as PengelolaDashboardController;
use App\Http\Controllers\Petugas\DashboardController as PetugasDashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [WelcomeController::class, 'index'])->name('welcome');

// RUTE UNTUK PENYEWAAN
Route::get('/penyewaan/buat', [PenyewaanController::class, 'create'])->name('penyewaan.create');
Route::post('/penyewaan/konfirmasi', [PenyewaanController::class, 'showConfirmation'])->name('penyewaan.showConfirmation');
Route::post('/penyewaan/simpan', [PenyewaanController::class, 'store'])->name('penyewaan.store');
Route::get('/penyewaan/berhasil', [PenyewaanController::class, 'success'])->name('penyewaan.success');
Route::get('/penyewaan/gagal', [PenyewaanController::class, 'failure'])->name('penyewaan.failure');
Route::post('/penyewaan/{id}/batalkan', [PenyewaanController::class, 'batalkanPenyewaan'])->name('penyewaan.batalkan');
Route::get('/penyewaan/invoice/{id_penyewaan}/download', [PenyewaanController::class, 'downloadInvoice'])
    ->name('penyewaan.invoice.download');

// RUTE UNTUK CEK PENYEWAAN
Route::get('/cek-penyewaan', [PenyewaanController::class, 'showCheckForm'])->name('penyewaan.check.form');
Route::post('/cek-penyewaan/proses', [PenyewaanController::class, 'processCheckStatus'])->name('penyewaan.check.process');
Route::get('/penyewaan/detail/{id_penyewaan}', [PenyewaanController::class, 'showDetailPenyewaan'])->name('penyewaan.detail');


// RUTE UNTUK LUPA ID PENYEWAAN
Route::get('/lupa-id-penyewaan', [LupaIdController::class, 'showForm'])->name('penyewaan.lupa_id.form');
Route::post('/lupa-id-penyewaan/cari', [LupaIdController::class, 'findIds'])->name('penyewaan.lupa_id.find');

// Rute untuk Dashboard Pengelola
Route::middleware(['auth', 'verified', 'role:pengelola'])->group(function () {
    Route::get('/pengelola/dashboard', [PengelolaDashboardController::class, 'index'])
        ->name('pengelola.dashboard');
    // Tambahkan rute lain khusus pengelola di sini
});

// Rute untuk Dashboard Petugas Lapangan
Route::middleware(['auth', 'verified', 'role:petugas_lapangan'])->group(function () {
    Route::get('/petugas/dashboard', [PetugasDashboardController::class, 'index'])
        ->name('petugas.dashboard');
    // Rute lain untuk petugas jika ada
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
