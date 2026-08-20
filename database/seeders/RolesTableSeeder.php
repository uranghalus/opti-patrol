<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesTableSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        $superAdmin = Role::firstOrCreate(['name' => 'superadmin']);
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $petugas = Role::firstOrCreate(['name' => 'petugas']);

        // Give superadmin all permissions
        $superAdmin->givePermissionTo(Permission::all());

        // Give admin all permissions except superadmin specific ones if any
        $admin->givePermissionTo(Permission::all());

        // Give superadmin all permissions
        $superAdmin->givePermissionTo(Permission::all());
    }
}
