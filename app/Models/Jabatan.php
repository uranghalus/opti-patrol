<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jabatan extends Model
{
    use HasFactory;

    protected $table = 'tbl_jabatan';

    protected $fillable = [
        'nama_jabatan',
        'roles'
    ];

    protected $casts = [
        'roles' => 'array'
    ];
    public function karyawans()
    {
        return $this->hasMany(Karyawan::class, 'jabatan_id', 'id');
    }
}
