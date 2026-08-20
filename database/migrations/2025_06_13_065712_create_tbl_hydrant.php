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
            $table->string('kode_unik')->unique();
            $table->string('kode_hydrant', 25)->unique();
            $table->string('ukuran')->nullable()->default('');
            $table->string('lantai')->nullable()->index();
            $table->string('lokasi');
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('hydrant_inspections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hydrant_id')->nullable()->constrained('hydrant')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('regu', ['PAGI', 'SIANG', 'MALAM', 'MIDDLE'])->default('PAGI')->index();
            $table->string('nama_petugas', 150)->nullable();
            $table->string('valve_machino_coupling', 150)->nullable();
            $table->string('fire_hose_machino_coupling', 150)->nullable();
            $table->string('selang_hydrant', 150)->nullable();
            $table->string('noozle_hydrant', 150)->nullable();
            $table->string('kaca_box_hydrant', 150)->nullable();
            $table->string('kunci_box_hydrant', 150)->nullable();
            $table->string('box_hydrant', 150)->nullable();
            $table->string('alarm', 150)->nullable();
            $table->string('foto_hydrant')->nullable();
            $table->timestamp('tanggal_inspeksi')->useCurrent()->index();
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
