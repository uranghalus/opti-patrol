<?php

namespace App\Http\Controllers;

use App\Models\Apar;
use App\Models\AparInspection;
use App\Models\Hydrant;
use App\Models\HydrantInspection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    //
    public function index()
    {
        $totalApar = Apar::count();
        $totalHydrant = Hydrant::count();
        $totalAparExpired = Apar::whereHas('lastInspection', function ($query) {
            $query->where('tanggal_kadaluarsa', '<', now());
        })->count();
        $totalInspeksiApar = AparInspection::whereMonth('tanggal_inspeksi', now()->month)->whereYear('tanggal_inspeksi', now()->year)->count();

        $bulanSekarang = now();
        $dataGrafik = [];
        for ($i = 5; $i >= 0; $i--) {
            $bulan = $bulanSekarang->copy()->subMonths($i);
            $label = $bulan->format('M'); // Jan, Feb, dst

            $apar = AparInspection::whereMonth('tanggal_inspeksi', $bulan->month)
                ->whereYear('tanggal_inspeksi', $bulan->year)
                ->count();

            $hydrant = HydrantInspection::whereMonth('tanggal_inspeksi', $bulan->month)
                ->whereYear('tanggal_inspeksi', $bulan->year)
                ->count();

            $dataGrafik[] = [
                'bulan' => $label,
                'apar' => $apar,
                'hydrant' => $hydrant,
            ];
        }
        $aparBermasalah = AparInspection::with('apar')
            ->where(function ($q) {
                $q->where('kondisi', 'NOT LIKE', '%baik%')->orWhereNull('kondisi');
            })
            ->orderByDesc('tanggal_inspeksi')
            ->take(5)
            ->get();
        return Inertia::render('dashboard', [
            'totalApar' => $totalApar,
            'totalHydrant' => $totalHydrant,
            'totalAparExpired' => $totalAparExpired,
            'totalInspeksiApar' => $totalInspeksiApar,
            'dataGrafikInspeksi' => $dataGrafik,
            'aparBermasalah' => $aparBermasalah->append('foto_apar_url')
        ]);
    }
}
