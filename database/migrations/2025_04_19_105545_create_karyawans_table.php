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
        Schema::create('tbl_karyawans', function (Blueprint $table) {
            $table->id('id_karyawan');
            $table->string('nik')->unique();
            $table->string('nama');
            $table->string('nama_alias')->nullable();
            $table->enum('gender', ['L', 'P']);
            $table->text('alamat');
            $table->string('no_ktp', 16)->unique();
            $table->string('telp', 16)->nullable();
            $table->foreignId('jabatan_id')
                ->nullable()
                ->constrained('tbl_jabatan')
                ->nullOnDelete();
            $table->foreignId('department_id')
                ->nullable()
                ->constrained('tbl_departments')
                ->nullOnDelete();
            $table->string('call_sign')->nullable();
            $table->date('tmk');
            $table->string('status_karyawan', 16)->index();
            $table->text('keterangan')->nullable();
            $table->string('user_image', 150)->nullable();
            $table->timestamp('create_date')->nullable();
            $table->foreignId('create_id_user')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamp('modified_date')->nullable();
            $table->foreignId('modified_id_user')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreign('karyawan_id')
                ->references('id_karyawan')
                ->on('tbl_karyawans')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['karyawan_id']);
        });

        Schema::dropIfExists('tbl_karyawans');
    }
};
