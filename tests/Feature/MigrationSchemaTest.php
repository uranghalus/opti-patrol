<?php

use Database\Seeders\PermissionsTableSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;

uses(RefreshDatabase::class);

test('core application tables and columns exist after migrations', function () {
    expect(Schema::hasTable('users'))->toBeTrue();
    expect(Schema::hasColumns('users', [
        'karyawan_id',
        'phone',
        'department',
        'position',
        'last_login_at',
        'last_login_ip',
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'two_factor_confirmed_at',
    ]))->toBeTrue();
    expect(Schema::hasTable('apar'))->toBeTrue();
    expect(Schema::hasTable('apar_inspections'))->toBeTrue();
    expect(Schema::hasTable('hydrant'))->toBeTrue();
    expect(Schema::hasColumns('hydrant', ['ukuran', 'kode_unik', 'kode_hydrant']))->toBeTrue();
    expect(Schema::hasTable('hydrant_inspections'))->toBeTrue();
    expect(Schema::hasTable('cek_point_security'))->toBeTrue();
    expect(Schema::hasTable('patroli_security'))->toBeTrue();
    expect(Schema::hasTable('tbl_offices'))->toBeTrue();
    expect(Schema::hasTable('tbl_departments'))->toBeTrue();
    expect(Schema::hasTable('tbl_jabatan'))->toBeTrue();
    expect(Schema::hasTable('tbl_karyawans'))->toBeTrue();
    expect(Schema::hasTable('roles'))->toBeTrue();
    expect(Schema::hasTable('permissions'))->toBeTrue();
    expect(Schema::hasTable('passkeys'))->toBeTrue();
});

test('permission seeder includes hydrant permissions', function () {
    $this->seed(PermissionsTableSeeder::class);

    expect(Permission::where('name', 'hydrant.view')->exists())->toBeTrue();
    expect(Permission::where('name', 'hydrant.export')->exists())->toBeTrue();
});
