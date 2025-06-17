<?php

namespace App\Http\Controllers\Pengelola;

use App\Http\Controllers\Controller;
use App\Models\Penyewaan;
use App\Models\Tenda;
use App\Models\Jadwal;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Twilio\Rest\Client;
use Illuminate\Support\Facades\Log;

class PenyewaanController extends Controller
{
    /**
     * Menampilkan daftar semua data penyewaan dengan filter.
     */
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

        // Transformasi data untuk frontend
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
     * Menampilkan detail satu penyewaan.
     */
    public function show(Penyewaan $penyewaan)
    {
        $penyewaan->load(['pelanggan', 'tenda', 'jadwal']);
        
        $tanggalSewa = Carbon::parse($penyewaan->tanggal_penyewaan);
        $tanggalSelesai = $tanggalSewa->copy()->addDays($penyewaan->durasi_penyewaan - 1);

        return Inertia::render('Pengelola/Penyewaan/Show', [
            'penyewaanDetail' => [
                'id_penyewaan' => $penyewaan->id_penyewaan,
                'catatan' => $penyewaan->catatan,
                'tanggal_sewa_formatted' => $tanggalSewa->isoFormat('D MMMM YYYY'),
                'tanggal_selesai_formatted' => $tanggalSelesai->isoFormat('D MMMM YYYY'),
                'durasi_sewa' => $penyewaan->durasi_penyewaan . ' Hari',
                'status' => $penyewaan->status,
                'total_biaya' => 'Rp' . number_format($penyewaan->biaya, 0, ',', '.'),
                'pelanggan' => $penyewaan->pelanggan,
                'item_tenda' => [
                    'kode_tenda' => 'TND-' . $penyewaan->tenda->id_tenda,
                    'nama_tenda' => $penyewaan->tenda->nama_tenda,
                    'harga' => 'Rp' . number_format($penyewaan->tenda->harga, 0, ',', '.'),
                    'jumlah' => $penyewaan->jumlah_tenda,
                    'subtotal' => 'Rp' . number_format($penyewaan->biaya, 0, ',', '.'),
                ],
                'jadwal' => $penyewaan->jadwal,
            ]
        ]);
    }

    /**
     * Memperbarui status penyewaan (Tolak, Batal, dll).
     */
    public function updateStatus(Request $request, Penyewaan $penyewaan)
    {
        $request->validate([
            'status' => 'required|string|in:' . implode(',', config('enums.penyewaan_status')),
            // Membuat alasan_penolakan wajib diisi jika statusnya 'Ditolak'
            'alasan_penolakan' => 'required_if:status,Ditolak|nullable|string|max:255',
        ]);

        $penyewaan->status = $request->status;
        $penyewaan->save();

        // Kirim notifikasi WhatsApp jika penyewaan ditolak
        if ($request->status === 'Ditolak' && $request->filled('alasan_penolakan')) {
            $this->sendWhatsAppRejection(
                $penyewaan->pelanggan->no_telp,
                $penyewaan->pelanggan->nama,
                $penyewaan->id_penyewaan,
                $request->alasan_penolakan
            );
        }

        return redirect()->back()->with('success', 'Status penyewaan berhasil diperbarui.');
    }

    /**
     * Mengirim pesan penolakan via WhatsApp menggunakan Twilio.
     */
    private function sendWhatsAppRejection($recipientNumber, $namaPelanggan, $id_penyewaan, $alasan)
    {
        $sid    = env("TWILIO_SID");
        $token  = env("TWILIO_TOKEN");
        $from   = env("TWILIO_WHATSAPP_FROM");
        
        // Pastikan nomor telepon dalam format E.164 (+62xxxx)
        if (strpos($recipientNumber, '08') === 0) {
            $recipientNumber = '+62' . substr($recipientNumber, 1);
        }

        $message  = "Yth. Bpk/Ibu {$namaPelanggan},\n\n";
        $message .= "Mohon maaf, pengajuan penyewaan Anda dengan ID *{$id_penyewaan}* tidak dapat kami proses (ditolak).\n\n";
        $message .= "Alasan: *{$alasan}*\n\n";
        $message .= "Jika ada pertanyaan lebih lanjut, silakan hubungi kami. Terima kasih atas pengertiannya.";

        try {
            $client = new Client($sid, $token);
            $client->messages->create("whatsapp:{$recipientNumber}", [
                "from" => "whatsapp:{$from}",
                "body" => $message,
            ]);
        } catch (\Exception $e) {
            // Jika gagal, catat error tanpa menghentikan aplikasi
            Log::error('Gagal mengirim WhatsApp: ' . $e->getMessage());
        }
    }

    /**
     * Membuat atau memperbarui jadwal pemasangan dan pembongkaran.
     */
    public function schedule(Request $request, Penyewaan $penyewaan)
    {
        $data = $request->validate([
            'tanggal_pemasangan' => 'required|date',
            'waktu_pemasangan' => 'required|date_format:H:i',
            'tanggal_pembongkaran' => 'required|date|after_or_equal:tanggal_pemasangan',
            'waktu_pembongkaran' => 'required|date_format:H:i',
        ]);

        // Validasi tambahan untuk waktu jika tanggalnya sama
        if ($data['tanggal_pemasangan'] === $data['tanggal_pembongkaran'] && $data['waktu_pembongkaran'] <= $data['waktu_pemasangan']) {
            return redirect()->back()->withErrors([
                'waktu_pembongkaran' => 'Waktu pembongkaran harus setelah waktu pemasangan jika di hari yang sama.'
            ])->withInput();
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

        return redirect()->back()->with('success', 'Penyewaan berhasil dijadwalkan.');
    }
}