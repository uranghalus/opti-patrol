<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class AparInspection extends Model
{
    //
    use HasFactory;

    protected $table = 'apar_inspections';

    protected $fillable = [
        'apar_id',
        'user_id',
        'regu',
        'tanggal_kadaluarsa',
        'kondisi',
        'catatan',
        'foto_apar',
        'nama_petugas',
        // 'tanggal_inspeksi',
        'tanggal_refill'
    ];


    public function getFotoAparUrlAttribute(): ?string
    {
        if (!$this->foto_apar) return null;

        return Storage::disk('s3')->url($this->foto_apar); // jika file public
    }
    // Relasi ke APAR
    public function apar()
    {
        return $this->belongsTo(Apar::class);
    }

    // Relasi ke user (pemeriksa)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
