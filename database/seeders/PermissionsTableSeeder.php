<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionsTableSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
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

            // CP Security Inspection (Patrol Security)
            'cp-inspection.view', 'cp-inspection.create', 'cp-inspection.edit',
            'cp-inspection.delete', 'cp-inspection.export',

            // Master Data
            'department index', 'department create', 'department edit', 'department delete',
            'jabatan index', 'jabatan create', 'jabatan edit', 'jabatan delete',
            'karyawan index', 'karyawan create', 'karyawan edit', 'karyawan delete',
            'unit bisnis index', 'unit bisnis create', 'unit bisnis edit', 'unit bisnis delete',

            // Reports / Rekap
            'reports apar-rekap', 'reports hydrant-rekap', 'reports cekpoint-rekap',
            'reports apar-pdf', 'reports hydrant-pdf', 'reports cekpoint-pdf',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }
    }
}
