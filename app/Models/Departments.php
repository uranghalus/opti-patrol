<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Departments extends Model
{
    //
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $table = 'tbl_departments';
    protected $fillable = ['department_code', 'name', 'office_id'];

    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    public function karyawans()
    {
        return $this->hasMany(Karyawan::class);
    }
}
