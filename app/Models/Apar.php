<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Apar extends Model
{
    //
    use HasFactory;

    protected $table = 'apar';

    protected $fillable = [
        'kode_apar',
        'lantai',
        'lokasi',
        'jenis',
        'size',
        'user_id'
    ];

    protected $casts = [
        'size' => 'decimal:1'
    ];

    public static $jenisApar = ['CO2', 'Powder', 'Foam', 'Air'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke inspeksi APAR
    public function inspections()
    {
        return $this->hasMany(AparInspection::class);
    }
    public function lastInspection()
    {
        return $this->hasOne(AparInspection::class)->latestOfMany('tanggal_inspeksi');
    }
}
