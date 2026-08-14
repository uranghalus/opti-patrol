<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class CPInspection extends Model
{
    //
    protected $table = 'patroli_security';

    protected $fillable = [
        'kode_cp',
        'user_id',
        'regu',
        'nama_petugas',
        'kondisi',
        'foto_kondisi',
        'bocoran',
        'foto_bocoran',
        'penerangan_lampu',
        'foto_penerangan_lampu',
        'kerusakan_fasum',
        'foto_kerusakan_fasum',
        'potensi_bahaya_api',
        'foto_potensi_bahaya_api',
        'potensi_bahaya_keorang',
        'foto_potensi_bahaya_keorang',
        'orang_mencurigakan',
        'foto_orang_mencurigakan',
        'tanggal_patroli',
    ];

    protected $casts = [
        'tanggal_patroli' => 'datetime',
    ];
    // ================================
    //   ACCESSORS FOTO S3 URL
    // ================================

    public function getFotoKondisiUrlAttribute()
    {
        if (!$this->foto_kondisi) return null;
        return Storage::disk('s3')->url($this->foto_kondisi);
    }

    public function getFotoBocoranUrlAttribute()
    {
        if (!$this->foto_bocoran) return null;
        return Storage::disk('s3')->url($this->foto_bocoran);
    }

    public function getFotoPeneranganLampuUrlAttribute()
    {
        if (!$this->foto_penerangan_lampu) return null;
        return Storage::disk('s3')->url($this->foto_penerangan_lampu);
    }

    public function getFotoKerusakanFasumUrlAttribute()
    {
        if (!$this->foto_kerusakan_fasum) return null;
        return Storage::disk('s3')->url($this->foto_kerusakan_fasum);
    }

    public function getFotoPotensiBahayaApiUrlAttribute()
    {
        if (!$this->foto_potensi_bahaya_api) return null;
        return Storage::disk('s3')->url($this->foto_potensi_bahaya_api);
    }

    public function getFotoPotensiBahayaKeorangUrlAttribute()
    {
        if (!$this->foto_potensi_bahaya_keorang) return null;
        return Storage::disk('s3')->url($this->foto_potensi_bahaya_keorang);
    }

    public function getFotoOrangMencurigakanUrlAttribute()
    {
        if (!$this->foto_orang_mencurigakan) return null;
        return Storage::disk('s3')->url($this->foto_orang_mencurigakan);
    }

    /**
     * Relasi ke cek_point_security
     */
    public function cekPoint()
    {
        return $this->belongsTo(CekPointSecurity::class, 'kode_cp');
    }

    /**
     * Relasi ke user (pemeriksa)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    // 🔥 Jika mau auto-append semua foto setiap kali
    protected $appends = [
        'foto_kondisi_url',
        'foto_bocoran_url',
        'foto_penerangan_lampu_url',
        'foto_kerusakan_fasum_url',
        'foto_potensi_bahaya_api_url',
        'foto_potensi_bahaya_keorang_url',
        'foto_orang_mencurigakan_url',
    ];
}
