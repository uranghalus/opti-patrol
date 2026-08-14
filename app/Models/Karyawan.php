<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Karyawan extends Model
{
    //
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $table = 'tbl_karyawans';
    protected $primaryKey = 'id_karyawan';

    protected $fillable = [
        'nik',
        'nama',
        'nama_alias',
        'gender',
        'alamat',
        'no_ktp',
        'telp',
        'department_id',
        'jabatan_id', // tambahkan ini
        'call_sign',
        'tmk',
        'status_karyawan',
        'keterangan',
        'user_image',
        'create_date',
        'create_id_user',
        'modified_date',
        'modified_id_user'
    ];

    public function department()
    {
        return $this->belongsTo(Departments::class);
    }

    public function user()
    {
        return $this->hasOne(User::class, 'karyawan_id', 'id_karyawan');
    }
    public function jabatan()
    {
        return $this->belongsTo(Jabatan::class, 'jabatan_id');
    }
}
