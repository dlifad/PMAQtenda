<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

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

    /**
     * Relasi dengan model Penyewaan.
     */
    public function penyewaan()
    {
        return $this->belongsTo(Penyewaan::class, 'id_penyewaan', 'id_penyewaan');
    }

    /**
     * Boot the model.
     * Di sinilah kita akan meletakkan logika event.
     */
    protected static function booted()
    {
        static::updated(function ($jadwal) {
            // Cek apakah kolom 'status' yang berubah
            if ($jadwal->isDirty('status')) {
                // Jika status jadwal menjadi 'terpasang'
                if ($jadwal->status === self::STATUS_TERPASANG) {
                    // Update status penyewaan menjadi 'berlangsung'
                    $jadwal->penyewaan->update(['status' => Penyewaan::STATUS_BERLANGSUNG]);
                } 
                // Jika status jadwal menjadi 'terbongkar'
                elseif ($jadwal->status === self::STATUS_TERBONGKAR) {
                    // Update status penyewaan menjadi 'selesai'
                    $jadwal->penyewaan->update(['status' => Penyewaan::STATUS_SELESAI]);
                }
            }
        });
    }
}