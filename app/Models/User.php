<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, HasRoles, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'karyawan_id',
        'name',
        'email',
        'password',
        'phone',
        'department',
        'position',
        'last_login_at',
        'last_login_ip',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class, 'karyawan_id', 'id_karyawan');
    }

    public function getUserPermisions()
    {
        return $this->getAllPermissions()->mapWithKeys(fn ($permission) => [$permission['name'] => true]);
    }

    // 👇 tambahkan ini
    protected static function booted()
    {
        static::updated(function ($karyawan) {
            // cek kalau jabatan_id berubah & ada user terhubung
            if ($karyawan->isDirty('jabatan_id') && $karyawan->user) {
                $newRoles = $karyawan->jabatan->roles ?? [];
                $karyawan->user->syncRoles($newRoles);
            }
        });
    }
}
