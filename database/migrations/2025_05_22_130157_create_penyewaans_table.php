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
        Schema::create('penyewaan', function (Blueprint $table) {
            $table->id('id_penyewaan');
            $table->foreignId('id_pelanggan')->constrained('pelanggan', 'id_pelanggan')->cascadeOnDelete();
            $table->foreignId('id_tenda')->constrained('tenda', 'id_tenda')->cascadeOnDelete();
            $table->date('tanggal_penyewaan');
            $table->integer('durasi_penyewaan');
            $table->decimal('biaya', 10, 2);
            $table->enum('status', ['menunggu', 'terjadwal', 'berlangsung', 'selesai', 'ditolak']);
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penyewaans');
    }
};
