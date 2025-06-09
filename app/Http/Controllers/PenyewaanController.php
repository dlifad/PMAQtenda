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
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;


class PenyewaanController extends Controller
{
    public function create(Request $request)
    {
        $allTendas = Tenda::where('jumlah', '>', 0)
            ->orderBy('nama_tenda')
            ->get(['id_tenda', 'nama_tenda', 'harga', 'isi_paket', 'jumlah as stok_tersedia']);

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

    public function showConfirmation(Request $request)
    {
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

        $validatedData = $validator->validated();
        foreach ($validatedData['selected_tendas'] as $index => $selectedTendaItem) {
            $tendaModel = Tenda::find($selectedTendaItem['tenda_id']);
            if (!$tendaModel || $tendaModel->jumlah < $selectedTendaItem['jumlah']) {
                $validator->errors()->add("selected_tendas.{$index}.jumlah", "Stok tenda " . ($tendaModel ? $tendaModel->nama_tenda : 'yang dipilih') . " tidak mencukupi (tersedia: " . ($tendaModel ? $tendaModel->jumlah : '0') . ").");
            }
        }
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $displayData = [
            'penyewa' => [
                'nama_lengkap' => $validatedData['nama_lengkap'],
                'nomor_telepon' => $validatedData['nomor_telepon'],
            ],
            'alamat_pemasangan' => $validatedData['alamat_pemasangan'],
            'rincian_penyewaan' => [
                'tanggal_sewa_formatted' => Carbon::parse($validatedData['tanggal_sewa'])->isoFormat('D MMMM YYYY'),
                'tanggal_sewa_raw' => $validatedData['tanggal_sewa'],
                'durasi' => $validatedData['durasi_penyewaan'] . ' hari',
                'durasi_raw' => $validatedData['durasi_penyewaan'],
                'catatan' => $validatedData['catatan'],
            ],
            'rincian_biaya' => [
                'items' => [],
                'total_biaya_raw' => 0,
                'total_biaya_formatted' => '',
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
        $displayData['rincian_biaya']['total_biaya_formatted'] = 'Rp' . number_format($totalBiayaKeseluruhan, 0, ',', '.');
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

    private function generateCustomPenyewaanId(): string
    {
        $prefix = 'SWA-';
        $year = Carbon::now()->format('y');
        $searchPrefixWithYear = $prefix . $year;

        $lastPenyewaan = Penyewaan::where('id_penyewaan', 'like', $searchPrefixWithYear . '%')
            ->orderBy('id_penyewaan', 'desc')
            ->first();
        $nextSequence = 1;
        if ($lastPenyewaan) {
            $sequencePart = substr($lastPenyewaan->id_penyewaan, strlen($searchPrefixWithYear));
            $lastSequence = intval($sequencePart);
            $nextSequence = $lastSequence + 1;
        }
        $paddedSequence = str_pad($nextSequence, 4, '0', STR_PAD_LEFT);

        return $searchPrefixWithYear . $paddedSequence;
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
            if (!$tendaModel || $tendaModel->jumlah < $selectedTendaItem['jumlah']) {
                return redirect()->route('penyewaan.create')
                    ->with('error', "Stok tenda " . ($tendaModel ? $tendaModel->nama_tenda : 'yang dipilih') . " berubah dan tidak mencukupi (tersedia: " . ($tendaModel ? $tendaModel->jumlah : '0') . ").")
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
            $penyewaanIds = [];
            $statusPenyewaan = 'menunggu';
            $tanggalSewa = Carbon::parse($validatedDataFromConfirm['tanggal_sewa']);
            $durasi = (int)$validatedDataFromConfirm['durasi_penyewaan'];
            $tanggalSelesaiSewa = $tanggalSewa->copy()->addDays($durasi - 1);

            foreach ($validatedDataFromConfirm['selected_tendas'] as $selectedTenda) {
                $tendaModel = Tenda::find($selectedTenda['tenda_id']);
                if (!$tendaModel) continue;

                $subtotal = $tendaModel->harga * $selectedTenda['jumlah'];
                $totalBiayaKeseluruhan += $subtotal;
                $customIdPenyewaan = $this->generateCustomPenyewaanId();

                $penyewaanBaru = Penyewaan::create([
                    'id_penyewaan' => $customIdPenyewaan,
                    'id_pelanggan' => $pelanggan->id_pelanggan,
                    'id_tenda' => $tendaModel->id_tenda,
                    'tanggal_penyewaan' => $validatedDataFromConfirm['tanggal_sewa'],
                    'durasi_penyewaan' => $validatedDataFromConfirm['durasi_penyewaan'],
                    'jumlah_tenda' => $selectedTenda['jumlah'],
                    'biaya' => $subtotal,
                    'status' => $validatedDataFromConfirm['status'] ?? 'menunggu',
                    'catatan' => $validatedDataFromConfirm['catatan'],
                ]);
                $penyewaanIds[] = $customIdPenyewaan;
                $statusPenyewaan = $penyewaanBaru->status;

                $tendaModel->decrement('jumlah', $selectedTenda['jumlah']);
            }

            DB::commit();
            $successData = [
                'idPenyewaan' => count($penyewaanIds) > 0 ? $penyewaanIds[0] : null,
                'namaPenyewa' => $pelanggan->nama,
                'noTelp' => $pelanggan->no_telp,
                'tanggalSewa' => $tanggalSewa->isoFormat('D MMMM YYYY') . ($durasi > 1 ? ' - ' . $tanggalSelesaiSewa->isoFormat('D MMMM YYYY') : ''),
                'totalBiaya' => 'Rp' . number_format($totalBiayaKeseluruhan, 0, ',', '.'),
                'statusPenyewaan' => $statusPenyewaan,
            ];
            return redirect()->route('penyewaan.success')->with('penyewaanDetails', $successData);
        } catch (\Exception $e) {
            DB::rollBack();
            \Illuminate\Support\Facades\Log::error('GAGAL SIMPAN PENYEWAAN: ' . $e->getMessage() . "\nFILE: " . $e->getFile() . "\nLINE: " . $e->getLine() . "\nTRACE:\n" . $e->getTraceAsString());
            return redirect()->route('penyewaan.failure')
                ->with('failureMessage', 'Maaf, terjadi kesalahan saat memproses penyewaan Anda. Silakan coba lagi atau hubungi dukungan jika masalah berlanjut.');
        }
    }

    public function success()
    {
        return Inertia::render('Penyewaan/Success');
    }

    public function failure()
    {
        return Inertia::render('Penyewaan/Failure');
    }

    public function downloadInvoice(Request $request, $idPenyewaan)
    {
        $penyewaan = Penyewaan::with(['pelanggan', 'tenda'])->find($idPenyewaan);

        if (!$penyewaan) {
            return redirect()->back()->with('error', 'Invoice penyewaan tidak ditemukan.');
        }

        $dataUntukPdf = [
            'penyewaan' => $penyewaan,
            'pelanggan' => $penyewaan->pelanggan,
            'itemTenda' => $penyewaan,
            'tanggalCetak' => \Carbon\Carbon::now()->isoFormat('D MMMM YYYY'),
        ];

        $namaFile = 'invoice-' . $penyewaan->id_penyewaan . '.pdf';

        $pdf = PDF::loadView('invoices.penyewaan', $dataUntukPdf);
        return $pdf->download($namaFile);
    }

    public function showCheckForm(Request $request)
    {
        return Inertia::render('Penyewaan/CekForm', [
            'errorNotFound' => session('penyewaan_check_error'),
            'initialSearchedId' => old('id_penyewaan_cek', session('searched_penyewaan_id')),
        ]);
    }

    public function processCheckStatus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_penyewaan_cek' => 'required|string|max:255',
        ], [
            'id_penyewaan_cek.required' => 'ID Penyewaan wajib diisi.',
        ]);

        if ($validator->fails()) {
            return redirect()->route('penyewaan.check.form')
                ->withErrors($validator)
                ->withInput();
        }

        $customId = $request->input('id_penyewaan_cek');
        $penyewaan = Penyewaan::where('id_penyewaan', $customId)->first();

        if ($penyewaan) {
            return redirect()->route('penyewaan.detail', ['id_penyewaan' => $penyewaan->id_penyewaan]);
        } else {
            return Inertia::render('Penyewaan/CekForm', [
                'penyewaan_check_error' => 'Penyewaan dengan ID tersebut tidak ditemukan.',
                'searched_penyewaan_id' => $customId,
            ]);
        }
    }

    public function showDetailPenyewaan(Request $request, $idPenyewaan)
    {
        $penyewaan = Penyewaan::with(['pelanggan', 'tenda'])
            ->where('id_penyewaan', $idPenyewaan)
            ->first();

        if (!$penyewaan) {
            return redirect()->route('penyewaan.check.form')
                ->with('penyewaan_check_error', 'Data penyewaan dengan ID tersebut tidak ditemukan.');
        }

        $detailData = [
            'id_penyewaan' => $penyewaan->id_penyewaan,
            'nama_penyewa' => $penyewaan->pelanggan->nama,
            'no_telp_penyewa' => $penyewaan->pelanggan->no_telp,
            'alamat_pemasangan' => $penyewaan->pelanggan->alamat,
            'nama_tenda' => $penyewaan->tenda->nama_tenda,
            'jumlah_tenda' => $penyewaan->jumlah_tenda,
            'tanggal_sewa' => Carbon::parse($penyewaan->tanggal_penyewaan)->isoFormat('D MMMM YYYY'),
            'durasi_penyewaan' => $penyewaan->durasi_penyewaan . ' hari',
            'catatan' => $penyewaan->catatan,
            'status' => $penyewaan->status,
            'biaya' => 'Rp' . number_format($penyewaan->biaya, 0, ',', '.'),
        ];

        return Inertia::render('Penyewaan/Detail', [
            'penyewaanDetail' => $detailData
        ]);
    }
}
