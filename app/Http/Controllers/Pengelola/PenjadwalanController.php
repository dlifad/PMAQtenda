<?php

namespace App\Http\Controllers\Pengelola;

use App\Http\Controllers\Controller;
use App\Models\Penyewaan;
use App\Models\Jadwal;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PenjadwalanController extends Controller
{
    /**
     * Menampilkan halaman utama penjadwalan.
     */
    public function index()
    {
        $perluDijadwalkan = Penyewaan::with(['pelanggan', 'tenda'])
            ->where('status', Penyewaan::STATUS_MENUNGGU)
            ->orderBy('id_penyewaan', 'desc')
            ->get()
            ->map(fn($item) => [
                'id_penyewaan' => $item->id_penyewaan,
                'nama_pelanggan' => $item->pelanggan->nama,
                'nama_tenda' => $item->tenda->nama_tenda,
                'jumlah_tenda' => $item->jumlah_tenda,
                'tanggal_sewa_mulai' => Carbon::parse($item->tanggal_penyewaan)->isoFormat('D MMMM YYYY'),
                'tanggal_sewa_selesai' => Carbon::parse($item->tanggal_penyewaan)
                    ->addDays($item->durasi_penyewaan - 1)
                    ->isoFormat('D MMMM YYYY'),

            ]);

        $sudahTerjadwal = Penyewaan::query()
            ->with(['pelanggan', 'jadwal'])
            ->join('jadwal', 'penyewaan.id_penyewaan', '=', 'jadwal.id_penyewaan')
            ->whereIn('penyewaan.status', [
                Penyewaan::STATUS_TERJADWAL,
                Penyewaan::STATUS_BERLANGSUNG,
                Penyewaan::STATUS_SELESAI
            ])
            ->select('penyewaan.*')
            ->orderBy('jadwal.id_jadwal', 'desc')
            ->get()
            ->map(fn($item) => [
                'id_penyewaan' => $item->id_penyewaan,
                'nama_pelanggan' => $item->pelanggan->nama,
                'tanggal_pemasangan' => Carbon::parse($item->jadwal->tanggal_pemasangan)->isoFormat('D MMMM YYYY'),
                'tanggal_pembongkaran' => Carbon::parse($item->jadwal->tanggal_pembongkaran)->isoFormat('D MMMM YYYY'),
                'status' => $item->status,
            ]);

        return Inertia::render('Pengelola/Penjadwalan/Index', [
            'perluDijadwalkan' => $perluDijadwalkan,
            'sudahTerjadwal' => $sudahTerjadwal,
        ]);
    }

    public function show($id)
    {
        $penyewaan = Penyewaan::with([
            'pelanggan',
            'tenda',
            'jadwal'
        ])
            ->where('id_penyewaan', $id)
            ->firstOrFail();

        $durasi = $penyewaan->durasi_penyewaan;
        $tanggalBerakhir = null;
        $durasiSewa = $durasi ? $durasi . ' Hari' : 'Tidak tersedia';

        if ($penyewaan->tanggal_penyewaan && $durasi) {
            $tanggalMulai = Carbon::parse($penyewaan->tanggal_penyewaan);
            $tanggalSelesai = $tanggalMulai->copy()->addDays($durasi - 1);
            $tanggalBerakhir = $tanggalSelesai->format('j F Y');
        } else {
            $durasiSewa = $penyewaan->durasi_penyewaan ? $penyewaan->durasi_penyewaan . ' Hari' : 'Tidak tersedia';
        }

        $detailPenjadwalan = [
            'id_penyewaan' => $penyewaan->id_penyewaan,
            'nama_pelanggan' => $penyewaan->pelanggan->nama,
            'status_penyewaan' => $penyewaan->status,
            'tanggal_sewa' => Carbon::parse($penyewaan->tanggal_penyewaan)->format('j F Y'),
            'tanggal_berakhir' => $tanggalBerakhir,
            'durasi_sewa' => $durasiSewa,
            'catatan' => $penyewaan->catatan ?? '-',
            'tanggal_pemasangan' => $penyewaan->jadwal
                ? $this->formatTanggalWaktu($penyewaan->jadwal->tanggal_pemasangan, $penyewaan->jadwal->waktu_pemasangan)
                : null,
            'tanggal_pembongkaran' => $penyewaan->jadwal
                ? $this->formatTanggalWaktu($penyewaan->jadwal->tanggal_pembongkaran, $penyewaan->jadwal->waktu_pembongkaran)
                : null,
            'detail_tenda' => [
                'kode_tenda' => $penyewaan->tenda->id_tenda,
                'nama_tenda' => $penyewaan->tenda->nama_tenda,
                'jumlah' => $penyewaan->jumlah_tenda,
            ],
            'jadwal_edit' => $penyewaan->jadwal ? [
                'tanggal_pemasangan' => Carbon::parse($penyewaan->jadwal->tanggal_pemasangan)->format('Y-m-d'),
                'waktu_pemasangan' => $penyewaan->jadwal->waktu_pemasangan,
                'tanggal_pembongkaran' => Carbon::parse($penyewaan->jadwal->tanggal_pembongkaran)->format('Y-m-d'),
                'waktu_pembongkaran' => $penyewaan->jadwal->waktu_pembongkaran,
            ] : null
        ];

        return Inertia::render('Pengelola/Penjadwalan/Show', [
            'detailPenjadwalan' => $detailPenjadwalan,
        ]);
    }


    /**
     * Helper function untuk format tanggal dan waktu sesuai gambar
     */
    private function formatTanggalWaktu($tanggal, $waktu)
    {
        if (!$tanggal) return null;

        $carbonTanggal = Carbon::parse($tanggal);

        if ($waktu) {
            $waktuFormatted = Carbon::parse($waktu)->format('H:i');
            return $waktuFormatted . ', ' . $carbonTanggal->format('j F Y');
        } else {
            return $carbonTanggal->format('j F Y');
        }
    }

    /**
     * Menyimpan jadwal penyewaan baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_penyewaan' => 'required|exists:penyewaan,id_penyewaan',
            'tanggal_pemasangan' => 'required|date',
            'waktu_pemasangan' => 'required|date_format:H:i',
            'tanggal_pembongkaran' => 'required|date|after_or_equal:tanggal_pemasangan',
            'waktu_pembongkaran' => 'required|date_format:H:i',
        ]);

        try {
            DB::beginTransaction();

            $existingJadwal = Jadwal::where('id_penyewaan', $request->id_penyewaan)->first();

            if ($existingJadwal) {
                return back()->withErrors(['error' => 'Penyewaan ini sudah memiliki jadwal.']);
            }

            $jadwal = new Jadwal();
            $jadwal->id_penyewaan = $request->id_penyewaan;
            $jadwal->tanggal_pemasangan = $request->tanggal_pemasangan;
            $jadwal->waktu_pemasangan = $request->waktu_pemasangan;
            $jadwal->tanggal_pembongkaran = $request->tanggal_pembongkaran;
            $jadwal->waktu_pembongkaran = $request->waktu_pembongkaran;
            $jadwal->save();

            $penyewaan = Penyewaan::findOrFail($request->id_penyewaan);
            $penyewaan->status = Penyewaan::STATUS_TERJADWAL;
            $penyewaan->save();

            DB::commit();

            return redirect()->route('pengelola.penjadwalan.index')
                ->with('success', 'Jadwal berhasil dibuat.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat menyimpan jadwal.']);
        }
    }

    /**
     * Update jadwal penyewaan yang sudah ada.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
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

        try {
            DB::beginTransaction();

            $jadwal = Jadwal::where('id_penyewaan', $id)->firstOrFail();

            $jadwal->tanggal_pemasangan = $request->tanggal_pemasangan;
            $jadwal->waktu_pemasangan = $request->waktu_pemasangan;
            $jadwal->tanggal_pembongkaran = $request->tanggal_pembongkaran;
            $jadwal->waktu_pembongkaran = $request->waktu_pembongkaran;
            $jadwal->save();

            DB::commit();

            return redirect()->route('pengelola.penjadwalan.show', $id)
                ->with('success', 'Jadwal berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui jadwal: ' . $e->getMessage()]);
        }
    }
}
