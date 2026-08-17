<?php

namespace App\Http\Controllers;

use App\Models\CekPointSecurity;
use App\Traits\GeneratesQrCode;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;

class CekpointSecurityController extends Controller implements HasMiddleware
{
    use GeneratesQrCode;

    public static function middleware()
    {
        return [
            new Middleware('permission:cekpoint-security.view', only: ['index', 'generateQRCode', 'generateMassQRCode', 'getFilterOptions']),
            new Middleware('permission:cekpoint-security.create', only: ['create', 'store', 'import']),
            new Middleware('permission:cekpoint-security.edit', only: ['edit', 'update']),
            new Middleware('permission:cekpoint-security.delete', only: ['destroy']),
            new Middleware('permission:cekpoint-security.generate-qr', only: ['generateQRCode', 'generateMassQRCode']),
            new Middleware('permission:cekpoint-security.export', only: ['generateQRCode', 'generateMassQRCode']),
        ];
    }

    public function index()
    {

        //
        $cekPointSecurityData = CekPointSecurity::all();

        return Inertia::render('fire-safety/cekpoint-security/Index', [
            'cekPointSecurityData' => $cekPointSecurityData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return Inertia::render('fire-safety/cekpoint-security/Create');
    }

    /**
     * Import View
     *
     * */
    public function showUploadForm()
    {
        return Inertia::render('fire-safety/cekpoint-security/ImportSecurity');
    }

    /**!SECTION
     * import functions
     */
    public function import(Request $request)
    {
        $cpdata = $request->input('cpdata', []);
        // Process the imported data as needed
        $validator = Validator::make(['cpdata' => $cpdata], [
            'cpdata.*.kode_cekpoint' => 'required|string|max:255|unique:cek_point_security,kode_cekpoint',
            'cpdata.*.lokasi' => 'nullable|string|max:255',
            'cpdata.*.lantai' => 'required|string|max:255',
            'cpdata.*.area' => 'nullable|string|max:255',
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        foreach ($cpdata as $data) {
            CekPointSecurity::updateOrCreate(
                ['kode_cekpoint' => $data['kode_cekpoint']],
                [
                    'lokasi' => $data['lokasi'] ?? null,
                    'lantai' => $data['lantai'],
                    'area' => $data['area'] ?? null,
                ]
            );
        }

        return redirect()->route('cekpoin-security.index')->with('success', 'Cek Point Security imported successfully.');
    }

    public function store(Request $request)
    {
        //
        $request->validate([
            'kode_cekpoint' => 'required|string|max:255|unique:cek_point_security,kode_cekpoint',
            'lokasi' => 'nullable|string|max:255',
            'lantai' => 'required|string|max:255',
            'area' => 'nullable|string|max:255',
        ]);
        CekPointSecurity::create($request->all());

        return redirect()->route('cekpoint-security.index')->with('success', 'Cek Point Security created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $cekPointSecurity = CekPointSecurity::findOrFail($id);

        return Inertia::render('fire-safety/cekpoint-security/Show', [
            'cekPointSecurity' => $cekPointSecurity,
        ]);
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        //
        $cekPointSecurity = CekPointSecurity::findOrFail($id);

        return Inertia::render('fire-safety/cekpoint-security/Edit', [
            'cekPointSecurity' => $cekPointSecurity,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
        $request->validate([
            'kode_cekpoint' => 'required|string|max:255|unique:cek_point_security,kode_cekpoint,'.$id,
            'lokasi' => 'nullable|string|max:255',
            'lantai' => 'required|string|max:255',
            'area' => 'nullable|string|max:255',
        ]);
        $cekPointSecurity = CekPointSecurity::findOrFail($id);
        $cekPointSecurity->update($request->all());

        return redirect()->route('cekpoin-security.index')->with('success', 'Cek Point Security updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $cekPointSecurity = CekPointSecurity::findOrFail($id);
        $cekPointSecurity->delete();

        return redirect()->route('cekpoin-security.index')->with('success', 'Cek Point Security deleted successfully.');
    }

    /**
     * filter data dari request
     *
     * */
    public function getFilterOptions()
    {
        $lantaiList = CekPointSecurity::distinct()->pluck('lantai')->filter()->values();
        $areaList = CekPointSecurity::distinct()->pluck('area')->filter()->values();
        $total = CekPointSecurity::count();
        $perPage = 30;
        $totalBatches = ceil($total / $perPage);

        return response()->json([
            'totalBatch' => $totalBatches,
            'lantai' => $lantaiList,
            'area' => $areaList,
        ]);
    }

    public function generateMassCekPointQRCode(Request $request)
    {
        ini_set('max_execution_time', 120);
        ini_set('memory_limit', '256M');

        $batch = $request->get('batch', 1);
        $lantai = $request->get('lantai');
        $area = $request->get('area');
        $perPage = 30;

        $query = CekPointSecurity::query();
        if ($lantai) {
            $query->where('lantai', $lantai);
        }
        if ($area) {
            $query->where('area', $area);
        }

        $cekPoints = $query
            ->orderBy('id')
            ->skip(($batch - 1) * $perPage)
            ->take($perPage)
            ->get();

        if (! $batch || ! is_numeric($batch) || $batch < 1 || $cekPoints->isEmpty()) {
            abort(404, 'Data tidak valid untuk dicetak.');
        }

        // Generate QR untuk setiap checkpoint
        $cekPoints = $cekPoints->map(function ($cekPoint) {
            $filename = 'qrcodes/cekpoint-qr-'.$cekPoint->kode_cekpoint.'.png';
            $storagePath = storage_path('app/public/'.$filename);

            $qr = $this->qrPng(url('/inspection/cekpoint-inspeksi/'.$cekPoint->id), 150);

            Storage::disk('public')->put($filename, $qr);

            return [
                'kode_cekpoint' => $cekPoint->kode_cekpoint,
                'lokasi' => $cekPoint->lokasi,
                'lantai' => $cekPoint->lantai,
                'area' => $cekPoint->area,
                'qr_base64' => 'data:image/png;base64,'.base64_encode(file_get_contents($storagePath)),
            ];
        });

        // Render HTML view PDF
        $html = View::make('cekpoint.qrexports_pdf', [
            'cekPoints' => $cekPoints,
            'batch' => $batch,
            'lantai' => $lantai,
            'area' => $area,
        ])->render();

        $pdf = Pdf::loadHTML($html)->setPaper('a4', 'portrait');

        return $pdf->download('qr-code-cekpoint-batch-'.$batch.'.pdf');
    }
}
