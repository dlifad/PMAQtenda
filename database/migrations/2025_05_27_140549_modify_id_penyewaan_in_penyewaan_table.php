<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('jadwal', function (Blueprint $table) {
            $table->dropForeign('jadwal_id_penyewaan_foreign');
        });


        Schema::table('jadwal', function (Blueprint $table) {
            $table->string('id_penyewaan', 36)->change();
        });

        Schema::table('penyewaan', function (Blueprint $table) {
            DB::statement('ALTER TABLE penyewaan MODIFY COLUMN id_penyewaan VARCHAR(36) NOT NULL');
        });

        Schema::table('jadwal', function (Blueprint $table) {
            $table->foreign('id_penyewaan')
                  ->references('id_penyewaan')
                  ->on('penyewaan')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('jadwal', function (Blueprint $table) {
            $table->dropForeign('jadwal_id_penyewaan_foreign');
        });

        Schema::table('jadwal', function (Blueprint $table) {
            $table->unsignedBigInteger('id_penyewaan')->change();
        });

        Schema::table('penyewaan', function (Blueprint $table) {
            DB::statement('ALTER TABLE penyewaan MODIFY COLUMN id_penyewaan BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY');
        });

        Schema::table('jadwal', function (Blueprint $table) {
            $table->foreign('id_penyewaan')
                  ->references('id_penyewaan')
                  ->on('penyewaan')
                  ->onDelete('cascade');
        });
    }
};