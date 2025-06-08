<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Ubah data lama terlebih dahulu agar tidak error saat enum diubah
        DB::table('jadwal')->where('status', 'berlangsung')->update(['status' => 'terpasang']);
        DB::table('jadwal')->where('status', 'selesai')->update(['status' => 'terbongkar']);

        // Ubah enum status
        DB::statement("ALTER TABLE jadwal MODIFY status ENUM('terjadwal', 'terpasang', 'terbongkar') NOT NULL");
    }

    public function down(): void
    {
        // Revert enum kembali ke versi sebelumnya
        DB::statement("ALTER TABLE jadwal MODIFY status ENUM('terjadwal', 'berlangsung', 'selesai') NOT NULL");

        // Revert data lama (opsional)
        DB::table('jadwal')->where('status', 'terpasang')->update(['status' => 'berlangsung']);
        DB::table('jadwal')->where('status', 'terbongkar')->update(['status' => 'selesai']);
    }
};

