<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\Relations\HasMany; // Tidak terpakai langsung di sini
// use Illuminate\Foundation\Auth\User as Authenticatable; // Tidak relevan untuk model ini
// use Laravel\Sanctum\HasApiTokens; // Tidak relevan untuk model ini

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
    protected $primaryKey = 'id_penyewaan'; // Tetap

    /**
     * Menandakan jika ID tidak auto-increment.
     *
     * @var bool
     */
    public $incrementing = false; // PENTING: Set ke false karena ID sekarang custom string

    /**
     * Tipe data dari primary key.
     *
     * @var string
     */
    protected $keyType = 'string'; // PENTING: Set ke string

    /**
     * Atribut yang dapat diisi
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id_penyewaan', // PENTING: Tambahkan id_penyewaan ke fillable
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
        // Nama foreign key di tabel jadwal, dan local key di tabel penyewaan
        return $this->hasOne(Jadwal::class, 'id_penyewaan', 'id_penyewaan');
    }
}