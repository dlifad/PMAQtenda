<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Jadwal extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang digunakan model ini
     *
     * @var string
     */
    protected $table = 'jadwal';

    /**
     * Primary key yang digunakan
     *
     * @var string
     */
    protected $primaryKey = 'id_jadwal';

    /**
     * Atribut yang dapat diisi
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id_penyewaan',
        'tanggal_pemasangan',
        'tanggal_pembongkaran',
        'status',
    ];

    /**
     * Relasi dengan tabel Penyewaan
     */
    public function penyewaan()
    {
        return $this->belongsTo(Penyewaan::class, 'id_penyewaan', 'id_penyewaan');
    }
}
