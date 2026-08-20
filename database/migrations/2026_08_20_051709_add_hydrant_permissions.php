<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $names = ['hydrant.view','hydrant.create','hydrant.edit','hydrant.delete','hydrant.generate-qr','hydrant.export'];
        foreach ($names as $name) {
            DB::table('permissions')->insertOrIgnore([
                'name' => $name,
                'guard_name' => 'web',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('permissions')->whereIn('name', [
            'hydrant.view','hydrant.create','hydrant.edit','hydrant.delete','hydrant.generate-qr','hydrant.export',
        ])->delete();
    }
};