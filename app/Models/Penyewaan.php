<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Penyewaan extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang digunakan model ini
     *
     * @var string
     */
    protected $table = 'penyewaan';

    /**
     * Primary key yang digunakan
     *
     * @var string
     */
    protected $primaryKey = 'id_penyewaan';

    /**
     * Menandakan jika ID tidak auto-increment.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * Tipe data dari primary key.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Konstanta untuk nilai status penyewaan.
     * Sesuaikan dengan nilai ENUM di database Anda.
     */
    public const STATUS_MENUNGGU = 'menunggu';
    public const STATUS_TERJADWAL = 'terjadwal'; // Atau 'dikonfirmasi' jika itu yang Anda gunakan
    public const STATUS_BERLANGSUNG = 'berlangsung';
    public const STATUS_SELESAI = 'selesai';
    public const STATUS_DITOLAK = 'ditolak';
    public const STATUS_DIBATALKAN = 'dibatalkan'; // Status baru yang ditambahkan

    /**
     * Atribut yang dapat diisi
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id_penyewaan',
        'id_pelanggan',
        'id_tenda',
        'tanggal_penyewaan',
        'durasi_penyewaan',
        'jumlah_tenda',
        'biaya',
        'status',
        'catatan',
    ];

    /**
     * Relasi dengan tabel Pelanggan
     */
    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'id_pelanggan', 'id_pelanggan');
    }

    /**
     * Relasi dengan tabel Tenda
     */
    public function tenda()
    {
        return $this->belongsTo(Tenda::class, 'id_tenda', 'id_tenda');
    }

    /**
     * Relasi dengan tabel Jadwal
     */
    public function jadwal()
    {
        return $this->hasOne(Jadwal::class, 'id_penyewaan', 'id_penyewaan');
    }
}
