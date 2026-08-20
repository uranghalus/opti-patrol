<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionsTableSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // permission users
        Permission::create(['name' => 'users index', 'guard_name' => 'web']);
        Permission::create(['name' => 'users create', 'guard_name' => 'web']);
        Permission::create(['name' => 'users edit', 'guard_name' => 'web']);
        Permission::create(['name' => 'users delete', 'guard_name' => 'web']);

        // permission roles
        Permission::create(['name' => 'roles index', 'guard_name' => 'web']);
        Permission::create(['name' => 'roles create', 'guard_name' => 'web']);
        Permission::create(['name' => 'roles edit', 'guard_name' => 'web']);
        Permission::create(['name' => 'roles delete', 'guard_name' => 'web']);

        // permission permissions
        Permission::create(['name' => 'permissions index', 'guard_name' => 'web']);
        Permission::create(['name' => 'permissions create', 'guard_name' => 'web']);
        Permission::create(['name' => 'permissions edit', 'guard_name' => 'web']);
        Permission::create(['name' => 'permissions delete', 'guard_name' => 'web']);

        // permission APAR
        Permission::create(['name' => 'apar.view', 'guard_name' => 'web']);
        Permission::create(['name' => 'apar.create', 'guard_name' => 'web']);
        Permission::create(['name' => 'apar.edit', 'guard_name' => 'web']);
        Permission::create(['name' => 'apar.delete', 'guard_name' => 'web']);
        Permission::create(['name' => 'apar.generate-qr', 'guard_name' => 'web']);
        Permission::create(['name' => 'apar.export', 'guard_name' => 'web']);

        // permission Hydrant
        Permission::create(['name' => 'hydrant.view', 'guard_name' => 'web']);
        Permission::create(['name' => 'hydrant.create', 'guard_name' => 'web']);
        Permission::create(['name' => 'hydrant.edit', 'guard_name' => 'web']);
        Permission::create(['name' => 'hydrant.delete', 'guard_name' => 'web']);
        Permission::create(['name' => 'hydrant.generate-qr', 'guard_name' => 'web']);
        Permission::create(['name' => 'hydrant.export', 'guard_name' => 'web']);
    }
}
