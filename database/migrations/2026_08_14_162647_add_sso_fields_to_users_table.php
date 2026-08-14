<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('karyawan_id')->nullable()->after('id');
            $table->string('phone')->nullable()->after('name');
            $table->string('department')->nullable()->after('phone');
            $table->string('position')->nullable()->after('department');
            $table->timestamp('last_login_at')->nullable()->after('position');
            $table->string('last_login_ip', 45)->nullable()->after('last_login_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['karyawan_id', 'phone', 'department', 'position', 'last_login_at', 'last_login_ip']);
        });
    }
};