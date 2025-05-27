<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

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
     * Atribut yang dapat diisi
     *
     * @var array<int, string>
     */
    protected $fillable = [
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
