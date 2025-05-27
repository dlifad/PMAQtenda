<?php

namespace App\Http\Controllers;

use App\Models\Pelanggan;
use App\Models\Penyewaan;
use App\Models\Tenda;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Arr;

class PenyewaanController extends Controller
{
    public function create(Request $request)
    {
        $allTendas = Tenda::where('jumlah', '>', 0)->orderBy('nama_tenda')->get(['id_tenda', 'nama_tenda', 'harga', 'isi_paket', 'jumlah as stok_tersedia']);
        $initialTendaId = $request->query('tenda_id');
        $initialTenda = null;

        if ($initialTendaId) {
            $initialTenda = $allTendas->firstWhere('id_tenda', $initialTendaId);
        }

        return Inertia::render('Penyewaan/Create', [
            'allTendas' => $allTendas,
            'initialTenda' => $initialTenda,
        ]);
    }

    /**
     * Memvalidasi data dan menampilkan halaman konfirmasi.
     */
    public function showConfirmation(Request $request)
    {
        // Validasi data yang sama seperti di method store
        $validator = Validator::make($request->all(), [
            'nama_lengkap' => 'required|string|max:255',
            'nomor_telepon' => 'required|string|max:20',
            'alamat_pemasangan' => 'required|string',
            'tanggal_sewa' => 'required|date|after_or_equal:today',
            'durasi_penyewaan' => 'required|integer|min:1',
            'catatan' => 'nullable|string',
            'selected_tendas' => 'required|array|min:1',
            'selected_tendas.*.tenda_id' => 'required|exists:tenda,id_tenda',
            'selected_tendas.*.jumlah' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Validasi stok tenda lagi (penting jika ada race condition atau data lama)
        $validatedData = $validator->validated();
        foreach ($validatedData['selected_tendas'] as $index => $selectedTendaItem) {
            $tendaModel = Tenda::find($selectedTendaItem['tenda_id']);
            if ($tendaModel->jumlah < $selectedTendaItem['jumlah']) {
                $validator->errors()->add("selected_tendas.{$index}.jumlah", "Stok tenda {$tendaModel->nama_tenda} tidak mencukupi (tersedia: {$tendaModel->jumlah}).");
            }
        }
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }


        // Siapkan data untuk ditampilkan di halaman konfirmasi
        $displayData = [
            'penyewa' => [
                'nama_lengkap' => $validatedData['nama_lengkap'],
                'nomor_telepon' => $validatedData['nomor_telepon'],
            ],
            'alamat_pemasangan' => $validatedData['alamat_pemasangan'],
            'rincian_penyewaan' => [
                'tanggal_sewa_formatted' => \Carbon\Carbon::parse($validatedData['tanggal_sewa'])->isoFormat('D MMMM YYYY'),
                'tanggal_sewa_raw' => $validatedData['tanggal_sewa'],
                'durasi' => $validatedData['durasi_penyewaan'] . ' hari',
                'durasi_raw' => $validatedData['durasi_penyewaan'],
                'catatan' => $validatedData['catatan'],
            ],
            'rincian_biaya' => [
                'items' => [],
                'total_biaya' => 0,
            ],
        ];

        $totalBiayaKeseluruhan = 0;
        $itemsForStore = [];

        foreach ($validatedData['selected_tendas'] as $item) {
            $tenda = Tenda::find($item['tenda_id']);
            if ($tenda) {
                $subtotal = $tenda->harga * $item['jumlah'];
                $displayData['rincian_biaya']['items'][] = [
                    'nama_tenda' => $tenda->nama_tenda,
                    'jumlah' => $item['jumlah'],
                    'harga_formatted' => number_format($tenda->harga, 0, ',', '.'),
                    'subtotal_formatted' => number_format($subtotal, 0, ',', '.'),
                    'tenda_id' => $tenda->id_tenda,
                    'harga_raw' => $tenda->harga,
                    'subtotal_raw' => $subtotal,
                ];
                $totalBiayaKeseluruhan += $subtotal;

                $itemsForStore[] = [
                    'tenda_id' => $tenda->id_tenda,
                    'jumlah' => $item['jumlah'],
                ];
            }
        }
        $displayData['rincian_biaya']['total_biaya_formatted'] = number_format($totalBiayaKeseluruhan, 0, ',', '.');
        $displayData['rincian_biaya']['total_biaya_raw'] = $totalBiayaKeseluruhan;

        $rawDataToStore = [
            'nama_lengkap' => $validatedData['nama_lengkap'],
            'nomor_telepon' => $validatedData['nomor_telepon'],
            'alamat_pemasangan' => $validatedData['alamat_pemasangan'],
            'tanggal_sewa' => $validatedData['tanggal_sewa'],
            'durasi_penyewaan' => $validatedData['durasi_penyewaan'],
            'catatan' => $validatedData['catatan'],
            'selected_tendas' => $itemsForStore,
        ];


        return Inertia::render('Penyewaan/Confirm', [
            'confirmationData' => $displayData,
            'rawDataToStore' => $rawDataToStore,
        ]);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_lengkap' => 'required|string|max:255',
            'nomor_telepon' => 'required|string|max:20',
            'alamat_pemasangan' => 'required|string',
            'tanggal_sewa' => 'required|date',
            'durasi_penyewaan' => 'required|integer|min:1',
            'catatan' => 'nullable|string',
            'selected_tendas' => 'required|array|min:1',
            'selected_tendas.*.tenda_id' => 'required|exists:tenda,id_tenda',
            'selected_tendas.*.jumlah' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return redirect()->route('penyewaan.create')->withErrors($validator)->withInput()->with('error', 'Terjadi kesalahan validasi saat konfirmasi akhir.');
        }

        $validatedDataFromConfirm = $validator->validated();

        foreach ($validatedDataFromConfirm['selected_tendas'] as $index => $selectedTendaItem) {
            $tendaModel = Tenda::find($selectedTendaItem['tenda_id']);
            if ($tendaModel->jumlah < $selectedTendaItem['jumlah']) {
                return redirect()->route('penyewaan.create')
                    ->with('error', "Stok tenda {$tendaModel->nama_tenda} berubah dan tidak mencukupi.")
                    ->withInput(Arr::except($validatedDataFromConfirm, ['selected_tendas']));
            }
        }


        DB::beginTransaction();
        try {
            $pelanggan = Pelanggan::create([
                'nama' => $validatedDataFromConfirm['nama_lengkap'],
                'no_telp' => $validatedDataFromConfirm['nomor_telepon'],
                'alamat' => $validatedDataFromConfirm['alamat_pemasangan'],
            ]);

            $totalBiayaKeseluruhan = 0;

            foreach ($validatedDataFromConfirm['selected_tendas'] as $selectedTenda) {
                $tendaModel = Tenda::find($selectedTenda['tenda_id']);
                if (!$tendaModel) continue;

                $subtotal = $tendaModel->harga * $selectedTenda['jumlah'];
                $totalBiayaKeseluruhan += $subtotal;

                Penyewaan::create([
                    'id_pelanggan' => $pelanggan->id_pelanggan,
                    'id_tenda' => $tendaModel->id_tenda,
                    'tanggal_penyewaan' => $validatedDataFromConfirm['tanggal_sewa'],
                    'durasi_penyewaan' => $validatedDataFromConfirm['durasi_penyewaan'],
                    'jumlah_tenda' => $selectedTenda['jumlah'],
                    'biaya' => $subtotal,
                    'status' => 'menunggu',
                    'catatan' => $validatedDataFromConfirm['catatan'],
                ]);

                $tendaModel->decrement('jumlah', $selectedTenda['jumlah']);
            }

            DB::commit();
            // Ganti 'welcome' dengan rute halaman sukses jika ada
            return redirect()->route('welcome')->with('success', 'Penyewaan berhasil dikonfirmasi! Total Biaya: ' . number_format($totalBiayaKeseluruhan, 0, ',', '.'));
        } catch (\Exception $e) {
            DB::rollBack();
            // BARIS INI SANGAT PENTING:
            \Illuminate\Support\Facades\Log::error('GAGAL SIMPAN PENYEWAAN: ' . $e->getMessage() . "\nFILE: " . $e->getFile() . "\nLINE: " . $e->getLine() . "\nTRACE:\n" . $e->getTraceAsString());

            return redirect()->route('penyewaan.create')->with('error', 'Gagal menyimpan penyewaan. Silakan cek log server untuk detail.')->withInput(Arr::except($validatedDataFromConfirm, ['selected_tendas']));
        }
    }
}
