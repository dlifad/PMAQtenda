<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Tenda extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang digunakan model ini
     *
     * @var string
     */
    protected $table = 'tenda';

    /**
     * Primary key yang digunakan
     *
     * @var string
     */
    protected $primaryKey = 'id_tenda';

    /**
     * Atribut yang dapat diisi
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama_tenda',
        'jumlah',
        'harga',
        'deskripsi',
        'isi_paket',
        'gambar',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'isi_paket' => 'array',
    ];

    /**
     * Relasi dengan tabel Penyewaan
     */
    public function penyewaan(): HasMany
    {
        return $this->hasMany(Penyewaan::class, 'id_tenda', 'id_tenda');
    }
}
