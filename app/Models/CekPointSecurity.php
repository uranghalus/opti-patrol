<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CekPointSecurity extends Model
{
    //
    protected $table = 'cek_point_security';
    protected $fillable = [
        'kode_cekpoint',
        'lokasi',
        'lantai',
        'area',
    ];
    public function inspections()
    {
        return $this->hasMany(CPInspection::class, 'kode_cp');
    }
}
