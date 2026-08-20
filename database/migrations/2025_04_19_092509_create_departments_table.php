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
        Schema::create('tbl_departments', function (Blueprint $table) {
            $table->id();
            $table->string('department_code', 8)->unique();
            $table->string('name');
            $table->foreignId('office_id')
                ->nullable()
                ->constrained('tbl_offices')
                ->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_departments');
    }
};
