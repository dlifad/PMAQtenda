<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('jadwal', function (Blueprint $table) {
            // Menambahkan kolom waktu setelah kolom tanggal masing-masing
            $table->time('waktu_pemasangan')->nullable()->after('tanggal_pemasangan');
            $table->time('waktu_pembongkaran')->nullable()->after('tanggal_pembongkaran');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jadwal', function (Blueprint $table) {
            $table->dropColumn(['waktu_pemasangan', 'waktu_pembongkaran']);
        });
    }
};
