<?php

namespace App\Http\Controllers\Pengelola;

use App\Http\Controllers\Controller;
use App\Models\Penyewaan;
use App\Models\Tenda;
use App\Models\Jadwal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class PenyewaanController extends Controller
{
    public function index(Request $request)
    {
        $tendas = Tenda::orderBy('nama_tenda')->get(['id_tenda', 'nama_tenda']);
        $statuses = collect(config('enums.penyewaan_status'));
        $query = Penyewaan::with(['pelanggan', 'tenda'])->orderByDesc('id_penyewaan');

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

    public function show(Penyewaan $penyewaan)
    {
        $penyewaan->load(['pelanggan', 'tenda', 'jadwal']);
        
        $tanggalSewa = Carbon::parse($penyewaan->tanggal_penyewaan);
        $tanggalSelesai = $tanggalSewa->copy()->addDays($penyewaan->durasi_penyewaan - 1);

        $jadwalFormatted = null;
        if ($penyewaan->jadwal) {
            $jadwalFormatted = [
                'tanggal_pemasangan' => $penyewaan->jadwal->tanggal_pemasangan,
                'waktu_pemasangan' => $penyewaan->jadwal->waktu_pemasangan,
                'tanggal_pembongkaran' => $penyewaan->jadwal->tanggal_pembongkaran,
                'waktu_pembongkaran' => $penyewaan->jadwal->waktu_pembongkaran,
                'status' => $penyewaan->jadwal->status,
            ];
        }

        return Inertia::render('Pengelola/Penyewaan/Show', [
            'penyewaanDetail' => [
                'id_penyewaan' => $penyewaan->id_penyewaan,
                'catatan' => $penyewaan->catatan,
                'tanggal_sewa_formatted' => $tanggalSewa->isoFormat('D MMMM YYYY'),
                'tanggal_selesai_formatted' => $tanggalSelesai->isoFormat('D MMMM YYYY'),
                'durasi_sewa' => $penyewaan->durasi_penyewaan . ' Hari',
                'status' => $penyewaan->status,
                'total_biaya' => 'Rp' . number_format($penyewaan->biaya, 0, ',', '.'),
                'pelanggan' => [
                    'nama' => $penyewaan->pelanggan->nama,
                    'no_telp' => $penyewaan->pelanggan->no_telp,
                    'alamat' => $penyewaan->pelanggan->alamat,
                ],
                'item_tenda' => [
                    'kode_tenda' => 'TND-' . $penyewaan->tenda->id_tenda,
                    'nama_tenda' => $penyewaan->tenda->nama_tenda,
                    'harga' => 'Rp' . number_format($penyewaan->tenda->harga, 0, ',', '.'),
                    'jumlah' => $penyewaan->jumlah_tenda,
                    'subtotal' => 'Rp' . number_format($penyewaan->biaya, 0, ',', '.'),
                ],
                'jadwal' => $jadwalFormatted,
                'tanggal_sewa_raw' => $penyewaan->tanggal_penyewaan,
                'tanggal_selesai_raw' => $tanggalSelesai->toDateString(),
            ]
        ]);
    }

    public function updateStatus(Request $request, Penyewaan $penyewaan)
    {
        $request->validate([
            'status' => 'required|string|in:' . implode(',', config('enums.penyewaan_status')),
        ]);

        $penyewaan->status = $request->status;
        $penyewaan->save();

        return redirect()->back()->with('success', 'Status penyewaan berhasil diperbarui.');
    }
    
    public function schedule(Request $request, Penyewaan $penyewaan)
    {
        $validator = Validator::make($request->all(), [
            'tanggal_pemasangan' => 'required|date',
            'waktu_pemasangan' => 'required|date_format:H:i',
            'tanggal_pembongkaran' => 'required|date|after_or_equal:tanggal_pemasangan',
            'waktu_pembongkaran' => 'required|date_format:H:i',
        ], [
            'tanggal_pemasangan.required' => 'Tanggal pemasangan harus diisi.',
            'tanggal_pemasangan.date' => 'Format tanggal pemasangan tidak valid.',
            'waktu_pemasangan.required' => 'Waktu pemasangan harus diisi.',
            'waktu_pemasangan.date_format' => 'Format waktu pemasangan harus HH:MM.',
            'tanggal_pembongkaran.required' => 'Tanggal pembongkaran harus diisi.',
            'tanggal_pembongkaran.date' => 'Format tanggal pembongkaran tidak valid.',
            'tanggal_pembongkaran.after_or_equal' => 'Tanggal pembongkaran harus sama atau setelah tanggal pemasangan.',
            'waktu_pembongkaran.required' => 'Waktu pembongkaran harus diisi.',
            'waktu_pembongkaran.date_format' => 'Format waktu pembongkaran harus HH:MM.',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        
        $data = $validator->validated();

        try {
            if ($data['tanggal_pemasangan'] === $data['tanggal_pembongkaran']) {
                if ($data['waktu_pembongkaran'] <= $data['waktu_pemasangan']) {
                    return redirect()->back()->withErrors([
                        'waktu_pembongkaran' => 'Waktu pembongkaran harus setelah waktu pemasangan pada hari yang sama.'
                    ])->withInput();
                }
            }

            Jadwal::updateOrCreate(
                ['id_penyewaan' => $penyewaan->id_penyewaan],
                [
                    'tanggal_pemasangan' => $data['tanggal_pemasangan'],
                    'waktu_pemasangan' => $data['waktu_pemasangan'],
                    'tanggal_pembongkaran' => $data['tanggal_pembongkaran'],
                    'waktu_pembongkaran' => $data['waktu_pembongkaran'],
                    'status' => 'terjadwal',
                ]
            );

            // Update status penyewaan utama
            $penyewaan->status = 'Terjadwal';
            $penyewaan->save();

            return redirect()->back()->with('success', 'Penyewaan berhasil dijadwalkan dengan waktu pemasangan dan pembongkaran.');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menjadwalkan penyewaan: ' . $e->getMessage());
        }
    }
}