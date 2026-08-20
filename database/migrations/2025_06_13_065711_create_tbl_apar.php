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
        Schema::create('apar', function (Blueprint $table) {
            $table->id();
            $table->string('kode_apar', 25)->unique();
            $table->string('lantai')->nullable()->index();
            $table->string('lokasi');
            $table->enum('jenis', ['CO2', 'Powder', 'Foam', 'Air'])->index();
            $table->decimal('size', 3, 1);
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('apar_inspections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('apar_id')->nullable()->constrained('apar')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('nama_petugas', 150)->nullable();
            $table->enum('regu', ['PAGI', 'SIANG', 'MALAM', 'MIDDLE'])->default('PAGI')->index();
            $table->date('tanggal_kadaluarsa')->nullable()->index();
            $table->date('tanggal_refill')->nullable();
            $table->string('kondisi', 150)->nullable();
            $table->text('catatan')->nullable();
            $table->string('foto_apar')->nullable();
            $table->timestamp('tanggal_inspeksi')->useCurrent()->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('apar_inspections');
        Schema::dropIfExists('apar');
    }
};
