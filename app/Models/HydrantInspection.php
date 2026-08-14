<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class HydrantInspection extends Model
{
    //
    protected $table = 'hydrant_inspections';

    protected $fillable = [
        'hydrant_id',
        'user_id',
        'nama_petugas',
        'regu',
        'valve_machino_coupling',
        'fire_hose_machino_coupling',
        'selang_hydrant',
        'noozle_hydrant',
        'kaca_box_hydrant',
        'kunci_box_hydrant',
        'box_hydrant',
        'alarm',
        'foto_hydrant',
        'tanggal_inspeksi',
    ];

    protected $casts = [
        'tanggal_inspeksi' => 'datetime',
    ];
    public function getFotoHydrantUrlAttribute(): ?string
    {
        if (!$this->foto_hydrant) return null;

        return Storage::disk('s3')->url($this->foto_hydrant); // jika file public
    }

    public function hydrant(): BelongsTo
    {
        return $this->belongsTo(Hydrant::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
