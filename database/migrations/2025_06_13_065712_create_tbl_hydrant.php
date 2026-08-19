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
        Schema::create('hydrant', function (Blueprint $table) {
            $table->id();
            $table->string('kode_unik')->unique(); // Contoh: "HYD-001"
            $table->string('kode_hydrant', 25)->unique(); // Contoh: "HYD Utama"
            $table->string('ukuran');
            $table->string('lantai')->nullable(); // Contoh: "Lantai 1"
            $table->string('lokasi');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        Schema::create('hydrant_inspections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hydrant_id')->nullable()->constrained('hydrant')->onDelete('set null');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null'); // Pemeriksa
            $table->enum('regu', ['PAGI', 'SIANG', 'MALAM', 'MIDDLE'])->default('PAGI');
            $table->string('nama_petugas', 150)->nullable(); // Bisa input bebas
            $table->string('valve_machino_coupling', 150)->nullable();
            $table->string('fire_hose_machino_coupling', 150)->nullable();
            $table->string('selang_hydrant', 150)->nullable();
            $table->string('noozle_hydrant', 150)->nullable();
            $table->string('kaca_box_hydrant', 150)->nullable();
            $table->string('kunci_box_hydrant', 150)->nullable();
            $table->string('box_hydrant', 150)->nullable();
            $table->string('alarm', 150)->nullable();
            $table->string('foto_hydrant')->nullable();
            $table->timestamp('tanggal_inspeksi')->default(now());
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hydrant_inspections');
        Schema::dropIfExists('hydrant');
    }
};
