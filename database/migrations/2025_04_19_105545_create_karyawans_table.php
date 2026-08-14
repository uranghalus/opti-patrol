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
            $table->unsignedBigInteger('jabatan_id')->nullable();

            $table->foreign('jabatan_id')
                ->references('id')
                ->on('tbl_jabatan')
                ->onDelete('set null');
            $table->unsignedBigInteger('department_id')->nullable();
            $table->foreign('department_id')
                ->references('id')
                ->on('tbl_departments')
                ->onDelete('set null');
            $table->string('call_sign')->nullable();
            $table->date('tmk'); // tanggal mulai kerja
            $table->string('status_karyawan', 16);
            $table->text('keterangan')->nullable();
            $table->string('user_image', 150)->nullable();
            $table->timestamp('create_date')->nullable();
            $table->unsignedBigInteger('create_id_user')->nullable();
            $table->timestamp('modified_date')->nullable();
            $table->unsignedBigInteger('modified_id_user')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_karyawans');
    }
};
