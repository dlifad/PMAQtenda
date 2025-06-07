<?php

namespace App\Http\Controllers\Pengelola;

use App\Http\Controllers\Controller;
use App\Models\Penyewaan;
use App\Models\Tenda;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class PenyewaanController extends Controller
{
    public function index(Request $request)
    {
        $tendas = Tenda::orderBy('nama_tenda')->get(['id_tenda', 'nama_tenda']);
        $statuses = collect(config('enums.penyewaan_status'));

        $query = Penyewaan::with(['pelanggan', 'tenda'])->latest('tanggal_penyewaan');

        if ($request->filled('search')) {
            $query->whereHas('pelanggan', function ($q) use ($request) {
                $q->where('nama', 'like', '%' . $request->search . '%');
            });
        }
        if ($request->filled('status') && $request->status !== 'Semua status') {
            $query->where('status', $request->status);
        }
        if ($request->filled('tenda') && $request->tenda !== 'Semua tenda') {
            $query->where('id_tenda', $request->tenda);
        }
        if ($request->filled('start_date')) {
            $query->where('tanggal_penyewaan', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->where('tanggal_penyewaan', '<=', $request->end_date);
        }

        $penyewaan = $query->paginate(10)->withQueryString();

        $penyewaan->getCollection()->transform(function ($item) {
            return [
                'id_penyewaan' => $item->id_penyewaan,
                'nama_pelanggan' => $item->pelanggan->nama,
                'nama_tenda' => $item->tenda->nama_tenda,
                'tanggal_penyewaan' => Carbon::parse($item->tanggal_penyewaan)->isoFormat('D MMMM YYYY'),
                'durasi_penyewaan' => $item->durasi_penyewaan . ' Hari',
                'status' => $item->status,
            ];
        });

        return Inertia::render('Pengelola/Penyewaan/Index', [
            'penyewaan' => $penyewaan,
            'filters' => $request->only(['search', 'status', 'tenda', 'start_date', 'end_date']),
            'tendaOptions' => $tendas,
            'statusOptions' => $statuses,
        ]);
    }

    // Tambahkan method lain seperti show, edit, update, destroy di sini jika diperlukan
}
