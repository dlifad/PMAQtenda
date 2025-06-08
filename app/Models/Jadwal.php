<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jadwal extends Model
{
    use HasFactory;

    protected $table = 'jadwal';
    protected $primaryKey = 'id_jadwal';

    // Konstanta untuk status jadwal
    public const STATUS_TERJADWAL = 'terjadwal';
    public const STATUS_TERPASANG = 'terpasang'; 
    public const STATUS_TERBONGKAR = 'terbongkar';

    protected $fillable = [
        'id_penyewaan',
        'tanggal_pemasangan',
        'waktu_pemasangan',
        'tanggal_pembongkaran',
        'waktu_pembongkaran',
        'status',
    ];

    public function penyewaan()
    {
        return $this->belongsTo(Penyewaan::class, 'id_penyewaan', 'id_penyewaan');
    }
}