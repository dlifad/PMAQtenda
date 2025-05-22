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
        Schema::create('jadwal', function (Blueprint $table) {
            $table->id('id_jadwal');
            $table->foreignId('id_penyewaan')->constrained('penyewaan', 'id_penyewaan')->cascadeOnDelete();
            $table->date('tanggal_pemasangan');
            $table->date('tanggal_pembongkaran');
            $table->enum('status', ['terjadwal', 'berlangsung', 'selesai']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwals');
    }
};
