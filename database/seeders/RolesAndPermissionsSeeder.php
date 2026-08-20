<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Definisi Permissions
        $permissions = [
            // Role Management
            'roles index',
            'roles create',
            'roles edit',
            'roles delete',
            'permissions index',
            'permissions create',
            'permissions edit',
            'permissions delete',
            
            // User Management
            'users index',
            'users create',
            'users edit',
            'users delete',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. Definisi Roles & Assignment
        
        // Super Admin (Akses penuh via Gate::before di AppServiceProvider)
        Role::firstOrCreate(['name' => 'superadmin']);

        // Admin (Akses manajemen)
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->syncPermissions(Permission::all());

        // Staff/User Biasa
        Role::firstOrCreate(['name' => 'staff']);
    }
}
