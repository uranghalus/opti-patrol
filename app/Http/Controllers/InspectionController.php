<?php

namespace App\Http\Controllers;

use App\Models\Apar;
use App\Models\CekPointSecurity;
use App\Models\CPInspection;
use App\Models\Hydrant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InspectionController extends Controller
{
    //
    public function aparinspeksi($id)
    {
        $inspection = Apar::findOrFail($id);
        return Inertia::render('inspection/apar', [
            'aparData' => $inspection
        ]);
    }
    public function hydrantinspeksi($id)
    {
        $inspection = Hydrant::findOrFail($id);
        return Inertia::render('inspection/hydrant', [
            'hydrantData' => $inspection
        ]);
    }
    public function cpinspeksi($id)
    {
        $inspection = CekPointSecurity::findOrFail($id);
        return Inertia::render('inspection/cekpoint', [
            'cekpointData' => $inspection
        ]);
    }
}
