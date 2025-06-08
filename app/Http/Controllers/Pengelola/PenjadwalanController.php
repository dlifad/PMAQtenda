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
        // 1. Mengambil data yang statusnya 'Menunggu' (Perlu Dijadwalkan)
        $perluDijadwalkan = Penyewaan::with(['pelanggan', 'tenda'])
            ->where('status', Penyewaan::STATUS_MENUNGGU)
            ->orderBy('tanggal_penyewaan', 'asc')
            ->get()
            ->map(fn ($item) => [
                'id_penyewaan' => $item->id_penyewaan,
                'nama_pelanggan' => $item->pelanggan->nama,
                'nama_tenda' => $item->tenda->nama_tenda,
                'jumlah_tenda' => $item->jumlah_tenda,
                'tanggal_sewa_mulai' => Carbon::parse($item->tanggal_penyewaan)->isoFormat('D MMMM YYYY'),
                'tanggal_sewa_selesai' => Carbon::parse($item->tanggal_berakhir)->isoFormat('D MMMM YYYY'),
            ]);

        // 2. Mengambil data yang sudah terjadwal dengan melakukan JOIN
        $sudahTerjadwal = Penyewaan::query()
            ->with(['pelanggan', 'jadwal'])
            ->join('jadwal', 'penyewaan.id_penyewaan', '=', 'jadwal.id_penyewaan')
            ->whereIn('penyewaan.status', [
                Penyewaan::STATUS_TERJADWAL,
                Penyewaan::STATUS_BERLANGSUNG,
                Penyewaan::STATUS_SELESAI
            ])
            ->select('penyewaan.*')
            ->orderBy('jadwal.tanggal_pemasangan', 'desc')
            ->get()
            ->map(fn ($item) => [
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

    /**
     * Menampilkan detail penjadwalan berdasarkan ID penyewaan.
     */
    public function show($id)
    {
        // Mengambil data penyewaan dengan relasi yang diperlukan
        $penyewaan = Penyewaan::with([
                'pelanggan', 
                'tenda', 
                'jadwal'
            ])
            ->where('id_penyewaan', $id)
            ->firstOrFail();

        // Hitung durasi sewa berdasarkan tanggal_penyewaan dan tanggal_berakhir
        $durasiSewa = null;
        if ($penyewaan->tanggal_penyewaan && $penyewaan->tanggal_berakhir) {
            $tanggalMulai = Carbon::parse($penyewaan->tanggal_penyewaan);
            $tanggalSelesai = Carbon::parse($penyewaan->tanggal_berakhir);
            $durasiHari = $tanggalMulai->diffInDays($tanggalSelesai) + 1; // +1 karena termasuk hari pertama
            $durasiSewa = $durasiHari . ' Hari';
        } else {
            // Jika salah satu tanggal tidak ada, coba hitung dari durasi_penyewaan jika ada
            $durasiSewa = $penyewaan->durasi_penyewaan ? $penyewaan->durasi_penyewaan . ' Hari' : 'Tidak tersedia';
        }

        // Format data untuk ditampilkan sesuai dengan gambar
        $detailPenjadwalan = [
            'id_penyewaan' => $penyewaan->id_penyewaan,
            'nama_pelanggan' => $penyewaan->pelanggan->nama,
            'status_penyewaan' => $penyewaan->status,
            'tanggal_sewa' => Carbon::parse($penyewaan->tanggal_penyewaan)->format('j F Y'),
            'durasi_sewa' => $durasiSewa,
            'catatan' => $penyewaan->catatan ?? '-', // Menambahkan field catatan
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
            ]
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
            // Format: 16:00, 17 April 2025
            $waktuFormatted = Carbon::parse($waktu)->format('H:i');
            return $waktuFormatted . ', ' . $carbonTanggal->format('j F Y');
        } else {
            // Jika waktu tidak tersedia, tampilkan hanya tanggal
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

            // Cek apakah sudah ada jadwal untuk penyewaan ini
            $existingJadwal = Jadwal::where('id_penyewaan', $request->id_penyewaan)->first();
            
            if ($existingJadwal) {
                return back()->withErrors(['error' => 'Penyewaan ini sudah memiliki jadwal.']);
            }

            // Buat jadwal baru
            $jadwal = new Jadwal();
            $jadwal->id_penyewaan = $request->id_penyewaan;
            $jadwal->tanggal_pemasangan = $request->tanggal_pemasangan;
            $jadwal->waktu_pemasangan = $request->waktu_pemasangan;
            $jadwal->tanggal_pembongkaran = $request->tanggal_pembongkaran;
            $jadwal->waktu_pembongkaran = $request->waktu_pembongkaran;
            $jadwal->save();

            // Update status penyewaan menjadi 'Terjadwal'
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
        ]);

        try {
            DB::beginTransaction();

            // Cari jadwal berdasarkan id_penyewaan
            $jadwal = Jadwal::where('id_penyewaan', $id)->firstOrFail();
            
            // Update jadwal
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
            return back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui jadwal.']);
        }
    }
}