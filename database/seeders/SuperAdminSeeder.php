<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class SuperAdminSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $email = 'superadmin@appdutamall.com';

        // Find or create the superadmin user
        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => 'Super Admin',
                'email' => $email,
                'password' => Hash::make('password'), // Change this to a secure password
                'email_verified_at' => now(),
            ]
        );

        // Get the superadmin role
        $superAdminRole = Role::where('name', 'superadmin')->first();

        if ($superAdminRole) {
            // Assign superadmin role to the user
            $user->assignRole($superAdminRole);

            $this->command->info("Super admin user created/updated: {$email}");
            $this->command->info('Assigned role: superadmin');
        } else {
            $this->command->error("Role 'superadmin' not found. Please run RolesTableSeeder first.");
        }
    }
}
