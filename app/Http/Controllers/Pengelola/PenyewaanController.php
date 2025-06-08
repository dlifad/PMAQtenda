<?php

namespace App\Http\Controllers\Pengelola;

use App\Http\Controllers\Controller;
use App\Models\Penyewaan;
use App\Models\Tenda;
use App\Models\Jadwal; // Import model Jadwal
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf; // Import PDF facade jika Anda sudah install

class PenyewaanController extends Controller
{
    /**
     * Menampilkan halaman daftar penyewaan dengan filter.
     */
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

    /**
     * Menampilkan halaman detail untuk satu penyewaan.
     */
    public function show(Penyewaan $penyewaan)
    {
        // Eager load relasi untuk efisiensi
        $penyewaan->load(['pelanggan', 'tenda', 'jadwal']);
        
        $tanggalSewa = Carbon::parse($penyewaan->tanggal_penyewaan);
        $tanggalSelesai = $tanggalSewa->copy()->addDays($penyewaan->durasi_penyewaan - 1);

        return Inertia::render('Pengelola/Penyewaan/Show', [
            'penyewaanDetail' => [
                'id_penyewaan' => $penyewaan->id_penyewaan,
                'catatan' => $penyewaan->catatan,
                'tanggal_sewa_formatted' => $tanggalSewa->isoFormat('D MMMM YYYY'),
                'durasi_sewa' => $penyewaan->durasi_penyewaan . ' Hari',
                'status' => $penyewaan->status,
                'total_biaya' => 'Rp' . number_format($penyewaan->biaya, 0, ',', '.'),
                'pelanggan' => [
                    'nama' => $penyewaan->pelanggan->nama,
                    'no_telp' => $penyewaan->pelanggan->no_telp,
                    'alamat' => $penyewaan->pelanggan->alamat,
                ],
                'item_tenda' => [
                    'kode_tenda' => 'TND-' . $penyewaan->tenda->id_tenda, // Contoh
                    'nama_tenda' => $penyewaan->tenda->nama_tenda,
                    'harga' => 'Rp' . number_format($penyewaan->tenda->harga, 0, ',', '.'),
                    'jumlah' => $penyewaan->jumlah_tenda,
                    'subtotal' => 'Rp' . number_format($penyewaan->biaya, 0, ',', '.'),
                ],
                'jadwal' => $penyewaan->jadwal, // Kirim data jadwal jika ada
                'tanggal_sewa_raw' => $penyewaan->tanggal_penyewaan, // Untuk default di form jadwal
                'tanggal_selesai_raw' => $tanggalSelesai->toDateString(),
            ]
        ]);
    }

    /**
     * Memperbarui status penyewaan (misal: membatalkan/menolak).
     */
    public function updateStatus(Request $request, Penyewaan $penyewaan)
    {
        $request->validate([
            'status' => 'required|string|in:' . implode(',', config('enums.penyewaan_status')),
        ]);

        $penyewaan->status = $request->status;
        $penyewaan->save();

        return redirect()->back()->with('success', 'Status penyewaan berhasil diperbarui.');
    }
    
    /**
     * Menjadwalkan pemasangan dan pembongkaran.
     */
    public function schedule(Request $request, Penyewaan $penyewaan)
    {
        $validator = Validator::make($request->all(), [
            'tanggal_pemasangan' => 'required|date',
            'tanggal_pembongkaran' => 'required|date|after_or_equal:tanggal_pemasangan',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        
        $data = $validator->validated();

        // Buat atau update jadwal
        Jadwal::updateOrCreate(
            ['id_penyewaan' => $penyewaan->id_penyewaan],
            [
                'tanggal_pemasangan' => $data['tanggal_pemasangan'],
                'tanggal_pembongkaran' => $data['tanggal_pembongkaran'],
                'status' => 'Terjadwal', // Status di tabel jadwal
            ]
        );

        // Update status penyewaan utama
        $penyewaan->status = Penyewaan::STATUS_TERJADWAL; // Gunakan konstanta dari model
        $penyewaan->save();

        return redirect()->back()->with('success', 'Penyewaan berhasil dijadwalkan.');
    }

}
