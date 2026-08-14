<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
    //
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $table = 'tbl_offices';
    protected $fillable = ['office_code', 'name', 'address'];

    public function departments()
    {
        return $this->hasMany(Departments::class);
    }
}
