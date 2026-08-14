<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hydrant extends Model
{
    //
    use HasFactory;

    protected $table = 'hydrant';

    protected $fillable = [
        'kode_unik',
        'kode_hydrant',
        'ukuran',
        'lantai',
        'lokasi',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function inspections()
    {
        return $this->hasMany(HydrantInspection::class);
    }
}
