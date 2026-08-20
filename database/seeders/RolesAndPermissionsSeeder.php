<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            // User Management
            'users index', 'users create', 'users edit', 'users delete',
            // Role Management
            'roles index', 'roles create', 'roles edit', 'roles delete',
            // Permission Management
            'permissions index', 'permissions create', 'permissions edit', 'permissions delete',
            // APAR Master
            'apar.view', 'apar.create', 'apar.edit', 'apar.delete',
            'apar.generate-qr', 'apar.export', 'apar.import',
            // Hydrant Master
            'hydrant.view', 'hydrant.create', 'hydrant.edit', 'hydrant.delete',
            'hydrant.generate-qr', 'hydrant.export', 'hydrant.import',
            // Cekpoint Security Master
            'cekpoin-security.view', 'cekpoin-security.create', 'cekpoin-security.edit',
            'cekpoin-security.delete', 'cekpoin-security.generate-qr',
            'cekpoin-security.export', 'cekpoin-security.import',
            // APAR Inspection
            'apar-inspection.view', 'apar-inspection.create', 'apar-inspection.edit',
            'apar-inspection.delete', 'apar-inspection.export',
            // Hydrant Inspection
            'hydrant-inspection.view', 'hydrant-inspection.create', 'hydrant-inspection.edit',
            'hydrant-inspection.delete', 'hydrant-inspection.export',
            // CP Security Inspection
            'cp-inspection.view', 'cp-inspection.create', 'cp-inspection.edit',
            'cp-inspection.delete', 'cp-inspection.export',
            // Master Data
            'department index', 'department create', 'department edit', 'department delete',
            'jabatan index', 'jabatan create', 'jabatan edit', 'jabatan delete',
            'karyawan index', 'karyawan create', 'karyawan edit', 'karyawan delete',
            'unit bisnis index', 'unit bisnis create', 'unit bisnis edit', 'unit bisnis delete',
            // Reports
            'reports apar-rekap', 'reports hydrant-rekap', 'reports cekpoint-rekap',
            'reports apar-pdf', 'reports hydrant-pdf', 'reports cekpoint-pdf',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Super Admin - full access via Gate::before
        Role::firstOrCreate(['name' => 'superadmin', 'guard_name' => 'web']);

        // Admin - all permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $adminRole->syncPermissions(Permission::all());

        // Petugas - view + create for operational modules
        $petugasRole = Role::firstOrCreate(['name' => 'petugas', 'guard_name' => 'web']);
        $petugasRole->syncPermissions(
            Permission::where(function ($q) {
                $q->where('name', 'like', '%.view')
                    ->orWhere('name', 'like', '%.create')
                    ->orWhere('name', 'like', '% index')
                    ->orWhere('name', 'like', '% create');
            })->get()
        );

        // Staff - read only
        $staffRole = Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'web']);
        $staffRole->syncPermissions(
            Permission::where('name', 'like', '%.view')
                ->orWhere('name', 'like', '% index')
                ->get()
        );
    }
}
