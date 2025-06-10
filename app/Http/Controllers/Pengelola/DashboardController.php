<?php

namespace App\Http\Controllers\Pengelola;

use App\Http\Controllers\Controller;
use App\Models\Penyewaan;
use App\Models\Tenda;
use App\Models\Pelanggan; // Pastikan model Pelanggan di-import jika belum
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $totalUnitTenda = Tenda::sum('jumlah');

        $penyewaAktifCount = Penyewaan::where('status', 'berlangsung')
            ->distinct('id_pelanggan')
            ->count('id_pelanggan');

        $antreanSewaCount = Penyewaan::whereIn('status', ['Dipesan', 'Menunggu'])->count();
        
        $belumTerjadwalCount = Penyewaan::where('status', 'Menunggu')->count();

        $penyewaanTerbaru = Penyewaan::with(['pelanggan', 'tenda'])
            ->orderBy('id_penyewaan', 'desc')
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id_penyewaan' => $item->id_penyewaan,
                    'nama_pelanggan' => $item->pelanggan->nama,
                    'nama_tenda' => $item->tenda->nama_tenda,
                    'tanggal_penyewaan' => Carbon::parse($item->tanggal_penyewaan)->isoFormat('D MMM YYYY'),
                    'durasi_penyewaan' => $item->durasi_penyewaan . ' Hari',
                    'status' => $item->status,
                ];
            });

        return Inertia::render('Pengelola/Dashboard', [
            'stats' => [
                'totalUnitTenda' => $totalUnitTenda,
                'penyewaAktifCount' => $penyewaAktifCount,
                'antreanSewaCount' => $antreanSewaCount,
                'belumTerjadwalCount' => $belumTerjadwalCount,
            ],
            'penyewaanTerbaru' => $penyewaanTerbaru,
        ]);
    }
}