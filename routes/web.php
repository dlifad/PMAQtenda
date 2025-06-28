<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\PenyewaanController;
use App\Http\Controllers\LupaIdController;
use App\Http\Controllers\FaqController;

use App\Http\Controllers\Pengelola\DashboardController as PengelolaDashboardController;
use App\Http\Controllers\Pengelola\TendaController as PengelolaTendaController;
use App\Http\Controllers\Pengelola\PenyewaanController as PengelolaPenyewaanController;
use App\Http\Controllers\Pengelola\PenjadwalanController as PengelolaPenjadwalanController;

use App\Http\Controllers\Petugas\DashboardController as PetugasDashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Beranda
Route::get('/', [WelcomeController::class, 'index'])->name('welcome');

// PENYEWAAN
Route::get('/penyewaan/buat', [PenyewaanController::class, 'create'])->name('penyewaan.create');
Route::post('/penyewaan/konfirmasi', [PenyewaanController::class, 'showConfirmation'])->name('penyewaan.showConfirmation');
Route::post('/penyewaan/simpan', [PenyewaanController::class, 'store'])->name('penyewaan.store');
Route::get('/penyewaan/berhasil', [PenyewaanController::class, 'success'])->name('penyewaan.success');
Route::get('/penyewaan/gagal', [PenyewaanController::class, 'failure'])->name('penyewaan.failure');
Route::post('/penyewaan/{id}/batalkan', [PenyewaanController::class, 'batalkanPenyewaan'])->name('penyewaan.batalkan');
Route::get('/penyewaan/invoice/{id_penyewaan}/download', [PenyewaanController::class, 'downloadInvoice'])->name('penyewaan.invoice.download');

Route::get('/cek-penyewaan', [PenyewaanController::class, 'showCheckForm'])->name('penyewaan.check.form');
Route::post('/cek-penyewaan/proses', [PenyewaanController::class, 'processCheckStatus'])->name('penyewaan.check.process');
Route::get('/penyewaan/detail/{id_penyewaan}', [PenyewaanController::class, 'showDetailPenyewaan'])->name('penyewaan.detail');

Route::get('/faq', [FaqController::class, 'index'])->name('faq.index');

Route::get('/lupa-id-penyewaan', [LupaIdController::class, 'showForm'])->name('penyewaan.lupa_id.form');
Route::post('/lupa-id-penyewaan/cari', [LupaIdController::class, 'findIds'])->name('penyewaan.lupa_id.find');


// PENGELOLA
Route::middleware(['auth', 'verified', 'role:pengelola'])->prefix('pengelola')->name('pengelola.')->group(function () {
    Route::get('/dashboard', [PengelolaDashboardController::class, 'index'])->name('dashboard');
    Route::resource('tenda', PengelolaTendaController::class);

    Route::controller(PengelolaPenyewaanController::class)->prefix('penyewaan')->name('penyewaan.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{penyewaan}', 'show')->name('show');
        Route::patch('/{penyewaan}/update-status', 'updateStatus')->name('updateStatus');
        Route::post('/{penyewaan}/schedule', 'schedule')->name('schedule');
    });

    Route::controller(PengelolaPenjadwalanController::class)->prefix('penjadwalan')->name('penjadwalan.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::get('/{id}', 'show')->name('show');
        Route::put('/{id}', 'update')->name('update');
    });
});


// PETUGAS LAPANGAN
Route::middleware(['auth', 'verified', 'role:petugas_lapangan'])->prefix('petugas')->name('petugas.')->group(function () {
    Route::get('/dashboard', [PetugasDashboardController::class, 'index'])->name('dashboard');
    Route::get('/jadwal/{id_jadwal}', [PetugasDashboardController::class, 'show'])->name('jadwal.show');
    Route::patch('/jadwal/{id_jadwal}/update-status', [PetugasDashboardController::class, 'updateStatus'])->name('jadwal.updateStatus');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
