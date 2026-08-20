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
        Schema::create('cek_point_security', function (Blueprint $table) {
            $table->id();
            $table->string('kode_cekpoint', 100)->unique();
            $table->string('lokasi')->nullable();
            $table->string('lantai', 100)->nullable()->index();
            $table->string('area', 100)->nullable()->index();
            $table->timestamps();
        });

        Schema::create('patroli_security', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kode_cp')->nullable()->constrained('cek_point_security')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('regu', ['PAGI', 'SIANG', 'MALAM', 'MIDDLE'])->default('PAGI')->index();
            $table->string('nama_petugas', 150)->nullable();
            $table->string('kondisi', 150)->nullable();
            $table->string('foto_kondisi', 150)->nullable();
            $table->string('bocoran', 150)->nullable();
            $table->string('foto_bocoran', 150)->nullable();
            $table->string('penerangan_lampu', 150)->nullable();
            $table->string('foto_penerangan_lampu', 150)->nullable();
            $table->string('kerusakan_fasum', 150)->nullable();
            $table->string('foto_kerusakan_fasum', 150)->nullable();
            $table->string('potensi_bahaya_api', 150)->nullable();
            $table->string('foto_potensi_bahaya_api', 150)->nullable();
            $table->string('potensi_bahaya_keorang', 150)->nullable();
            $table->string('foto_potensi_bahaya_keorang', 150)->nullable();
            $table->string('orang_mencurigakan', 150)->nullable();
            $table->string('foto_orang_mencurigakan', 150)->nullable();
            $table->string('kondisi_lain', 150)->nullable();
            $table->string('foto_kondisi_lain', 150)->nullable();
            $table->timestamp('tanggal_patroli')->useCurrent()->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patroli_security');
        Schema::dropIfExists('cek_point_security');
    }
};
