<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\Relations\HasMany; // Tidak terpakai langsung
// use Illuminate\Foundation\Auth\User as Authenticatable; // Tidak relevan
// use Laravel\Sanctum\HasApiTokens; // Tidak relevan

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
    protected $primaryKey = 'id_jadwal'; // Ini tetap auto-increment integer

    /**
     * Menandakan jika ID auto-increment.
     * (Defaultnya true untuk integer primary keys, jadi bisa diabaikan jika id_jadwal adalah int auto-increment)
     * @var bool
     */
    // public $incrementing = true; // Tidak perlu diubah jika id_jadwal adalah int auto-increment

    /**
     * Tipe data dari primary key.
     * (Defaultnya 'int', jadi bisa diabaikan jika id_jadwal adalah int auto-increment)
     * @var string
     */
    // protected $keyType = 'int'; // Tidak perlu diubah jika id_jadwal adalah int auto-increment


    /**
     * Atribut yang dapat diisi
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id_penyewaan', // Ini adalah foreign key, tipenya di DB harus sudah diubah jadi string
        'tanggal_pemasangan',
        'tanggal_pembongkaran',
        'status',
    ];

    /**
     * Relasi dengan tabel Penyewaan
     */
    public function penyewaan()
    {
        // Foreign key di tabel ini (jadwal), dan owner key di tabel penyewaan
        return $this->belongsTo(Penyewaan::class, 'id_penyewaan', 'id_penyewaan');
    }
}