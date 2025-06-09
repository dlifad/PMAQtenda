<?php

namespace App\Http\Controllers;

use App\Models\Pelanggan;
use App\Models\Penyewaan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Carbon\Carbon;

class LupaIdController extends Controller
{
    public function showForm()
    {
        return Inertia::render('Penyewaan/LupaIdForm', [
            'foundPenyewaanIds' => session('found_penyewaan_ids'),
            'searchError' => session('lupa_id_error'),
            'oldInput' => session('_old_input', []),
        ]);
    }

    public function findIds(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_penyewa' => 'required|string|max:255',
            'nomor_telepon' => 'required|string|max:20',
            'tanggal_sewa_lupa' => 'required|date',
        ], [
            'nama_penyewa.required' => 'Nama penyewa wajib diisi.',
            'nomor_telepon.required' => 'Nomor telepon wajib diisi.',
            'tanggal_sewa_lupa.required' => 'Tanggal sewa wajib diisi.',
            'tanggal_sewa_lupa.date' => 'Format tanggal sewa tidak valid.',
        ]);

        if ($validator->fails()) {
            return redirect()->route('penyewaan.lupa_id.form')
                ->withErrors($validator)
                ->withInput();
        }

        $namaPenyewa = $request->input('nama_penyewa');
        $nomorTelepon = $request->input('nomor_telepon');
        $tanggalSewa = $request->input('tanggal_sewa_lupa');

        $pelanggan = Pelanggan::where('nama', 'LIKE', "%{$namaPenyewa}%")
                              ->where('no_telp', $nomorTelepon)
                              ->first();

        if ($pelanggan) {
            $penyewaanRecords = Penyewaan::where('id_pelanggan', $pelanggan->id_pelanggan)
                                        ->whereDate('tanggal_penyewaan', $tanggalSewa)
                                        ->orderBy('created_at', 'desc')
                                        ->get(['id_penyewaan', 'tanggal_penyewaan', 'status']);

            if ($penyewaanRecords->isNotEmpty()) {
                if ($penyewaanRecords->count() === 1) {
                    $singlePenyewaan = $penyewaanRecords->first();
                    return redirect()->route('penyewaan.detail', ['id_penyewaan' => $singlePenyewaan->id_penyewaan]);
                } else {
                    $foundIds = $penyewaanRecords->map(function ($item) {
                        return [
                            'id' => $item->id_penyewaan,
                            'tanggal' => Carbon::parse($item->tanggal_penyewaan)->isoFormat('D MMMM YYYY'),
                            'status' => $item->status,
                        ];
                    });
                    return redirect()->route('penyewaan.lupa_id.form')
                        ->with('found_penyewaan_ids', $foundIds)
                        ->withInput();
                }
            }
        }

        return redirect()->route('penyewaan.lupa_id.form')
            ->with('lupa_id_error', 'Tidak ditemukan Penyewaan yang cocok dengan informasi yang Anda berikan.')
            ->withInput();
    }
}