<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\Penyewaan;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Pagination\Paginator;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $today = Carbon::today()->toDateString();
        $totalJadwal = Jadwal::count();
        $menungguCount = Jadwal::where('status', '!=', 'terbongkar')->count();
        $pemasanganHariIni = Jadwal::where('status', 'terjadwal')
            ->whereDate('tanggal_pemasangan', $today)->count();
        $pembongkaranHariIni = Jadwal::where('status', 'terpasang')
            ->whereDate('tanggal_pembongkaran', $today)->count();
        $jadwals = Jadwal::with(['penyewaan.pelanggan', 'penyewaan.tenda'])
            ->whereIn('status', ['terjadwal', 'terpasang'])
            ->get();
        $daftarTugas = new Collection();

        foreach ($jadwals as $jadwal) {
            $now = Carbon::now();

            $waktuPemasangan = Carbon::parse($jadwal->tanggal_pemasangan . ' ' . $jadwal->waktu_pemasangan);
            $waktuPembongkaran = Carbon::parse($jadwal->tanggal_pembongkaran . ' ' . $jadwal->waktu_pembongkaran);

            // Tugas Pemasangan
            if ($jadwal->status === 'terjadwal') {

                $daftarTugas->push([
                    'id_tugas' => $jadwal->id_jadwal . '-pemasangan',
                    'id_jadwal' => $jadwal->id_jadwal,
                    'id_penyewaan' => $jadwal->id_penyewaan,
                    'penyewa' => $jadwal->penyewaan->pelanggan->nama,
                    'lokasi' => $jadwal->penyewaan->pelanggan->alamat,
                    'tanggal_tugas' => $jadwal->tanggal_pemasangan,
                    'waktu_tugas' => $jadwal->waktu_pemasangan,
                    'tanggal_pembongkaran' => $jadwal->tanggal_pembongkaran,
                    'waktu_pembongkaran' => $jadwal->waktu_pembongkaran,
                    'jenis_jadwal' => 'Pemasangan',
                    'status' => $jadwal->status,
                    'nama_tenda' => $jadwal->penyewaan->tenda->nama_tenda ?? 'Tidak tersedia',
                    'jumlah_tenda' => $jadwal->penyewaan->jumlah_tenda ?? 0,
                ]);

                $daftarTugas->push([
                    'id_tugas' => $jadwal->id_jadwal . '-pembongkaran',
                    'id_jadwal' => $jadwal->id_jadwal,
                    'id_penyewaan' => $jadwal->id_penyewaan,
                    'penyewa' => $jadwal->penyewaan->pelanggan->nama,
                    'lokasi' => $jadwal->penyewaan->pelanggan->alamat,
                    'tanggal_tugas' => $jadwal->tanggal_pembongkaran,
                    'waktu_tugas' => $jadwal->waktu_pembongkaran,
                    'tanggal_pemasangan' => $jadwal->tanggal_pemasangan,
                    'waktu_pemasangan' => $jadwal->waktu_pemasangan,
                    'jenis_jadwal' => 'Pembongkaran',
                    'status' => $jadwal->status,
                    'nama_tenda' => $jadwal->penyewaan->tenda->nama_tenda ?? 'Tidak tersedia',
                    'jumlah_tenda' => $jadwal->penyewaan->jumlah_tenda ?? 0,
                ]);
            }

            if ($jadwal->status === 'terpasang') {

                $daftarTugas->push([
                    'id_tugas' => $jadwal->id_jadwal . '-pembongkaran',
                    'id_jadwal' => $jadwal->id_jadwal,
                    'id_penyewaan' => $jadwal->id_penyewaan,
                    'penyewa' => $jadwal->penyewaan->pelanggan->nama,
                    'lokasi' => $jadwal->penyewaan->pelanggan->alamat,
                    'tanggal_tugas' => $jadwal->tanggal_pembongkaran,
                    'waktu_tugas' => $jadwal->waktu_pembongkaran,
                    'tanggal_pemasangan' => $jadwal->tanggal_pemasangan,
                    'waktu_pemasangan' => $jadwal->waktu_pemasangan,
                    'jenis_jadwal' => 'Pembongkaran',
                    'status' => $jadwal->status,
                    'nama_tenda' => $jadwal->penyewaan->tenda->nama_tenda ?? 'Tidak tersedia',
                    'jumlah_tenda' => $jadwal->penyewaan->jumlah_tenda ?? 0,
                ]);
            }
        }


        // Urutkan semua tugas berdasarkan tanggal dan waktu
        $daftarTugas = $daftarTugas->sortBy(function ($tugas) {
            return $tugas['tanggal_tugas'] . ' ' . $tugas['waktu_tugas'];
        })->values();

        // Buat Paginasi Manual dari Koleksi
        $perPage = 10;
        $currentPage = Paginator::resolveCurrentPage('page');
        $currentPageItems = $daftarTugas->slice(($currentPage - 1) * $perPage, $perPage)->values();

        $daftarJadwalPaginated = new LengthAwarePaginator(
            $currentPageItems,
            $daftarTugas->count(),
            $perPage,
            $currentPage,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        // Format data setelah paginasi
        $daftarJadwalPaginated->getCollection()->transform(function ($item) {
            return [
                'id_tugas' => $item['id_tugas'],
                'id_jadwal' => $item['id_jadwal'],
                'id_penyewaan' => $item['id_penyewaan'],
                'tanggal' => Carbon::parse($item['tanggal_tugas'])->isoFormat('D MMMM YYYY'),
                'waktu' => Carbon::parse($item['waktu_tugas'])->format('H:i'),
                'penyewa' => $item['penyewa'],
                'lokasi' => $item['lokasi'],
                'jenis_jadwal' => $item['jenis_jadwal'],
                'status' => $item['status'],
                'nama_tenda' => $item['nama_tenda'],
                'jumlah_tenda' => $item['jumlah_tenda'],
                'tanggal_pemasangan' => isset($item['tanggal_pemasangan']) ? Carbon::parse($item['tanggal_pemasangan'])->isoFormat('D MMMM YYYY') : null,
                'waktu_pemasangan' => isset($item['waktu_pemasangan']) ? Carbon::parse($item['waktu_pemasangan'])->format('H:i') : null,
                'tanggal_pembongkaran' => isset($item['tanggal_pembongkaran']) ? Carbon::parse($item['tanggal_pembongkaran'])->isoFormat('D MMMM YYYY') : null,
                'waktu_pembongkaran' => isset($item['waktu_pembongkaran']) ? Carbon::parse($item['waktu_pembongkaran'])->format('H:i') : null,
            ];
        });

        return Inertia::render('Petugas/Dashboard', [
            'stats' => [
                'totalJadwal' => $totalJadwal,
                'menunggu' => $menungguCount,
                'pemasanganHariIni' => $pemasanganHariIni,
                'pembongkaranHariIni' => $pembongkaranHariIni
            ],
            'daftarJadwal' => $daftarJadwalPaginated,
        ]);
    }

    public function updateStatus(Request $request, $id_jadwal)
    {
        $request->validate(['status' => 'required|string|in:terpasang,terbongkar']);

        $jadwal = Jadwal::findOrFail($id_jadwal);

        if ($jadwal->status === 'terjadwal' && $request->status === 'terpasang') {
            $jadwal->status = 'terpasang';
        } elseif ($jadwal->status === 'terpasang' && $request->status === 'terbongkar') {
            $jadwal->status = 'terbongkar';
        } else {
            return redirect()->back()->with('error', 'Perubahan status tidak diizinkan.');
        }

        $jadwal->save();
        return redirect()->back()->with('success', 'Status jadwal berhasil diperbarui.');
    }

    public function show($id_jadwal, Request $request)
    {
        $jenis = $request->get('jenis', 'pemasangan');

        if (!in_array($jenis, ['pemasangan', 'pembongkaran'])) {
            $jenis = 'pemasangan';
        }

        $jadwal = Jadwal::with(['penyewaan.pelanggan', 'penyewaan.tenda'])
            ->where('id_jadwal', $id_jadwal)
            ->firstOrFail();

        $tanggal_tugas = $jenis === 'pemasangan' ? $jadwal->tanggal_pemasangan : $jadwal->tanggal_pembongkaran;
        $waktu_tugas = $jenis === 'pemasangan' ? $jadwal->waktu_pemasangan : $jadwal->waktu_pembongkaran;

        $detailJadwal = [
            'id_jadwal' => $jadwal->id_jadwal,
            'id_penyewaan' => $jadwal->id_penyewaan,
            'status' => $jadwal->status,
            'jenis_tugas' => $jenis,

            'tanggal_tugas' => Carbon::parse($tanggal_tugas)->isoFormat('D MMMM YYYY'),
            'waktu_tugas' => Carbon::parse($waktu_tugas)->format('H:i'),

            'tanggal_pemasangan' => Carbon::parse($jadwal->tanggal_pemasangan)->isoFormat('D MMMM YYYY'),
            'waktu_pemasangan' => Carbon::parse($jadwal->waktu_pemasangan)->format('H:i'),
            'tanggal_pembongkaran' => Carbon::parse($jadwal->tanggal_pembongkaran)->isoFormat('D MMMM YYYY'),
            'waktu_pembongkaran' => Carbon::parse($jadwal->waktu_pembongkaran)->format('H:i'),
            'catatan_penyewa' => $jadwal->penyewaan->catatan ?? '-',

            'tenda' => [
                'nama' => $jadwal->penyewaan->tenda->nama_tenda ?? 'Tidak tersedia',
                'jumlah' => $jadwal->penyewaan->jumlah_tenda ?? 0,
            ],


            'penyewa' => [
                'nama' => $jadwal->penyewaan->pelanggan->nama,
                'nomor_telp' => $jadwal->penyewaan->pelanggan->nomor_telp,
                'alamat' => $jadwal->penyewaan->pelanggan->alamat,
            ],
        ];

        return Inertia::render('Petugas/Show', [
            'jadwal' => $detailJadwal
        ]);
    }
}
