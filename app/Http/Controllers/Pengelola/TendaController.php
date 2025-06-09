<?php

namespace App\Http\Controllers\Pengelola;

use App\Http\Controllers\Controller;
use App\Models\Tenda;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class TendaController extends Controller
{
    public function index()
    {
        $tendas = Tenda::orderBy('id_tenda', 'asc')->paginate(10)->through(fn ($tenda) => [
            'id_tenda' => $tenda->id_tenda,
            'nama_tenda' => $tenda->nama_tenda,
            'harga' => 'Rp' . number_format($tenda->harga, 0, ',', '.'),
            'jumlah' => $tenda->jumlah,
            'gambar_url' => $tenda->gambar ? Storage::url($tenda->gambar) : null,
        ]);

        return Inertia::render('Pengelola/Tenda/Index', [
            'tendas' => $tendas,
        ]);
    }

    public function create()
    {
        return Inertia::render('Pengelola/Tenda/Create');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_tenda' => 'required|string|max:255',
            'jumlah' => 'required|integer|min:0',
            'harga' => 'required|numeric|min:0',
            'deskripsi' => 'nullable|string',
            'isi_paket' => 'nullable|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        if ($request->hasFile('gambar')) {
            $data['gambar'] = $this->storeGambar($request->file('gambar'));
        }

        $data['isi_paket'] = $this->parseIsiPaket($data['isi_paket'] ?? null);

        Tenda::create($data);

        return redirect()->route('pengelola.tenda.index')->with('success', 'Tenda berhasil ditambahkan.');
    }

    public function edit(Tenda $tenda)
    {
        return Inertia::render('Pengelola/Tenda/Edit', [
            'tenda' => [
                'id_tenda' => $tenda->id_tenda,
                'nama_tenda' => $tenda->nama_tenda,
                'jumlah' => $tenda->jumlah,
                'harga' => $tenda->harga,
                'deskripsi' => $tenda->deskripsi,
                'isi_paket' => is_array($tenda->isi_paket) ? implode(', ', $tenda->isi_paket) : $tenda->isi_paket,
                'gambar_url' => $tenda->gambar ? Storage::url($tenda->gambar) : null,
            ],
        ]);
    }

    public function update(Request $request, Tenda $tenda)
    {
        $validator = Validator::make($request->all(), [
            'nama_tenda' => 'required|string|max:255',
            'jumlah' => 'required|integer|min:0',
            'harga' => 'required|numeric|min:0',
            'deskripsi' => 'nullable|string',
            'isi_paket' => 'nullable|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        if ($request->hasFile('gambar')) {
            if ($tenda->gambar) {
                Storage::disk('public')->delete($tenda->gambar);
            }

            $data['gambar'] = $this->storeGambar($request->file('gambar'));
        }

        $data['isi_paket'] = $this->parseIsiPaket($data['isi_paket'] ?? null);

        $tenda->update($data);

        return redirect()->route('pengelola.tenda.index')->with('success', 'Data tenda berhasil diperbarui.');
    }

    public function destroy(Tenda $tenda)
    {
        if ($tenda->gambar) {
            Storage::disk('public')->delete($tenda->gambar);
        }

        $tenda->delete();

        return redirect()->route('pengelola.tenda.index')->with('success', 'Tenda berhasil dihapus.');
    }

    /**
     * Menyimpan gambar ke disk 'public' dengan path 'tenda_images'.
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @return string $path relatif dari disk 'public'
     */
    protected function storeGambar($file)
    {
        return $file->store('tenda_images', 'public'); 
    }

    /**
     * Konversi isi_paket string menjadi array.
     *
     * @param string|null $isi
     * @return array
     */
    protected function parseIsiPaket(?string $isi): array
    {
        return $isi ? array_map('trim', explode(',', $isi)) : [];
    }
}
