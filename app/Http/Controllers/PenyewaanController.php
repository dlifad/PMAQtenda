<?php

namespace App\Http\Controllers;

use App\Models\Pelanggan;
use App\Models\Penyewaan;
use App\Models\Tenda;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class PenyewaanController extends Controller
{
    /**
     * Menampilkan form pembuatan penyewaan.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
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
            'csrf_token' => csrf_token(),
        ]);
    }

    /**
     * Menyimpan data penyewaan baru.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
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
        ], [
            'nama_lengkap.required' => 'Nama lengkap wajib diisi.',
            'nomor_telepon.required' => 'Nomor telepon wajib diisi.',
            'alamat_pemasangan.required' => 'Alamat pemasangan wajib diisi.',
            'tanggal_sewa.required' => 'Tanggal sewa wajib diisi.',
            'tanggal_sewa.date' => 'Format tanggal sewa tidak valid.',
            'tanggal_sewa.after_or_equal' => 'Tanggal sewa tidak boleh kurang dari hari ini.',
            'durasi_penyewaan.required' => 'Durasi penyewaan wajib diisi.',
            'durasi_penyewaan.integer' => 'Durasi penyewaan harus berupa angka.',
            'durasi_penyewaan.min' => 'Durasi penyewaan minimal 1 hari.',
            'selected_tendas.required' => 'Minimal pilih satu tenda.',
            'selected_tendas.*.tenda_id.required' => 'Pilihan tenda wajib diisi.',
            'selected_tendas.*.tenda_id.exists' => 'Tenda yang dipilih tidak valid.',
            'selected_tendas.*.jumlah.required' => 'Jumlah untuk setiap tenda wajib diisi.',
            'selected_tendas.*.jumlah.min' => 'Jumlah minimal untuk setiap tenda adalah 1.',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        foreach ($request->selected_tendas as $index => $selectedTenda) {
            $tendaModel = Tenda::find($selectedTenda['tenda_id']);
            if ($tendaModel->jumlah < $selectedTenda['jumlah']) {
                $validator->errors()->add("selected_tendas.{$index}.jumlah", "Stok tenda {$tendaModel->nama_tenda} tidak mencukupi (tersedia: {$tendaModel->jumlah}).");
            }
        }
         if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }


        DB::beginTransaction();
        try {
            $pelanggan = Pelanggan::create([
                'nama' => $request->nama_lengkap,
                'no_telp' => $request->nomor_telepon,
                'alamat' => $request->alamat_pemasangan,
            ]);

            $totalBiayaKeseluruhan = 0;
            foreach ($request->selected_tendas as $selectedTenda) {
                $tendaModel = Tenda::find($selectedTenda['tenda_id']);
                if (!$tendaModel) continue;

                $subtotal = $tendaModel->harga * $selectedTenda['jumlah'];
                $totalBiayaKeseluruhan += $subtotal;

                Penyewaan::create([
                    'id_pelanggan' => $pelanggan->id_pelanggan,
                    'id_tenda' => $tendaModel->id_tenda,
                    'tanggal_penyewaan' => $request->tanggal_sewa,
                    'durasi_penyewaan' => $request->durasi_penyewaan,
                    'jumlah_tenda' => $selectedTenda['jumlah'],
                    'biaya' => $subtotal,
                    'status' => 'menunggu',
                    'catatan' => $request->catatan,
                ]);

                $tendaModel->decrement('jumlah', $selectedTenda['jumlah']);
            }

            DB::commit();

            return redirect()->route('welcome')->with('success', 'Penyewaan berhasil diajukan! Total biaya: ' . number_format($totalBiayaKeseluruhan, 0, ',', '.'));

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Terjadi kesalahan saat memproses penyewaan: ' . $e->getMessage())->withInput();
        }
    }
}