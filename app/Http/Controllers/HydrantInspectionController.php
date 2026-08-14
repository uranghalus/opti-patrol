<?php

namespace App\Http\Controllers;

use App\Models\Hydrant;
use App\Models\HydrantInspection;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Intervention\Image\Laravel\Facades\Image;

class HydrantInspectionController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:hydrant-inspection.view', only: ['index', 'rekap', 'exportPdf']),
            new Middleware('permission:hydrant-inspection.create', only: ['create', 'store']),
            new Middleware('permission:hydrant-inspection.edit', only: ['edit', 'update']),
            new Middleware('permission:hydrant-inspection.delete', only: ['destroy']),
            new Middleware('permission:hydrant-inspection.export', only: ['exportPdf']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $inspections = HydrantInspection::with(['hydrant', 'user.karyawan'])->latest()->get();
        return Inertia::render('fire-safety/inspection/hydrant/Index', [
            'inspections' => $inspections,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        $hydrants = Hydrant::all();
        return Inertia::render('fire-safety/inspection/hydrant/Create', [
            'hydrants' => $hydrants,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        ini_set('max_execution_time', 120);
        ini_set('memory_limit', '256M');
        try {
            //code...
            $validated = $request->validate([
                'hydrant_id' => ['required', 'exists:hydrant,id'],
                'regu' => ['required', 'in:PAGI,MIDDLE,SIANG,MALAM'],
                'nama_petugas' => ['required', 'string', 'max:150'],
                'selang_hydrant' => ['required', 'string'],
                'noozle_hydrant' => ['required', 'string'],
                'valve_machino_coupling' => ['required', 'string'],
                'fire_hose_machino_coupling' => ['required', 'string'],
                'kunci_box_hydrant' => ['required', 'string'],
                'kaca_box_hydrant' => ['required', 'string'],
                'box_hydrant' => ['required', 'string'],
                'alarm' => ['required', 'string'],

                // terima base64 ATAU file
                'foto_hydrant' => ['required'],
            ]);
            $validated['user_id'] = Auth::id();

            $finalPath = null;
            // CASE 1 — FILE UPLOAD
            if ($request->hasFile('foto_hydrant')) {
                $request->validate([
                    'foto_hydrant' => ['image', 'mimes:jpg,jpeg,png', 'max:4096'],
                ]);
                $image = Image::read($request->file('foto_hydrant'));
                $filename = 'hydrant-' . time() . '-' . Str::random(5) . '.jpg';
                $path = "inspection/hydrant/{$filename}";
                $uploadedFile = $image->toJpeg(75);
                Storage::disk('s3')->put($path, (string) $uploadedFile);

                $finalPath = $path;
            } elseif (Str::startsWith($request->foto_hydrant, 'data:image')) {
                $data = explode(',', $request->foto_hydrant)[1];
                $decoded = base64_decode($data);

                $image = Image::read($decoded);

                $filename = 'hydrant-' . time() . '-' . Str::random(5) . '.jpg';
                $path = "inspection/hydrant/{$filename}";

                $compressed = $image->toJpeg(75);
                Storage::disk('s3')->put($path, $compressed);

                $finalPath = $path;
            } else {
                return back()->withErrors(['foto_hydrant' => 'Foto tidak valid']);
            }

            $validated['foto_hydrant'] = $finalPath;
            HydrantInspection::create($validated);
            return redirect()->route('inspection.hydrant.index')->with('success', 'Inspeksi Hydrant berhasil ditambahkan.');
        } catch (\Exception $e) {
            Log::error('Hydrant Upload Failed', [
                'msg' => $e->getMessage(),
                'line' => $e->getLine(),
            ]);

            return back()->withErrors([
                'msg' => $e->getMessage(),
                'line' => $e->getLine(),
            ])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
        $inspection = HydrantInspection::with(['hydrant', 'user.karyawan'])->findOrFail($id);
        return Inertia::render('fire-safety/inspection/hydrant/Show', [
            'inspection' => $inspection->append('foto_hydrant_url'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        //
        $inspections = HydrantInspection::with(['hydrant', 'user.karyawan'])->findOrFail($id);
        $hydrants = Hydrant::all();
        return Inertia::render('fire-safety/inspection/hydrant/Edit', [
            'inspection' => $inspections,
            'hydrants' => $hydrants,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $inspection = HydrantInspection::findOrFail($id);
        $fileName = 'inspeksi_' . time() . '.jpg';

        $validated = $request->validate([
            'hydrant_id' => ['required', 'exists:hydrant,id'],
            'regu'       => ['required', Rule::in(['PAGI', 'SIANG', 'MALAM', 'MIDDLE'])],
            'valve_machino_coupling'     => ['nullable', 'string', 'max:150'],
            'nama_petugas' => ['required', 'string', 'max:150'],
            'fire_hose_machino_coupling' => ['nullable', 'string', 'max:150'],
            'selang_hydrant'             => ['nullable', 'string', 'max:150'],
            'noozle_hydrant'             => ['nullable', 'string', 'max:150'],
            'kaca_box_hydrant'           => ['nullable', 'string', 'max:150'],
            'kunci_box_hydrant'          => ['nullable', 'string', 'max:150'],
            'box_hydrant'                => ['nullable', 'string', 'max:150'],
            'alarm'                      => ['nullable', 'string', 'max:150'],
            'foto_hydrant' => ['nullable', function ($attribute, $value, $fail) {
                if ($value && !Str::startsWith($value, 'data:image')) {
                    $fail('The ' . $attribute . ' must be a valid base64 image.');
                }
            }],
        ]);

        $validated['regu'] = str_replace('REGU ', 'Regu ', $validated['regu']);
        $validated['user_id'] = Auth::id();

        // === Update image if changed ===
        if ($request->filled('foto_hydrant') && Str::startsWith($request->foto_hydrant, 'data:image/')) {
            // Delete old photo if exists
            if ($inspection->foto_hydrant && Storage::disk('s3')->exists($inspection->foto_hydrant)) {
                Storage::disk('s3')->delete($inspection->foto_hydrant);
            }

            $imageData = explode(',', $request->foto_hydrant)[1];
            $decodedImage = base64_decode($imageData);

            $image = Image::read($decodedImage);

            if ($image->width() > 1200) {
                $image->resize(1200, null);
            }

            $compressed = $image->toJpeg(75);
            $path = "inspection/hydrant/{$fileName}";
            Storage::disk('s3')->put($path, (string) $compressed);

            $validated['foto_hydrant'] = $path;
        }
        $inspection->update($validated);

        return redirect()->route('inspection.hydrant.index')->with('success', 'Inspeksi Hydrant berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $inspection = HydrantInspection::findOrFail($id);

        // Delete image from S3
        if ($inspection->foto_hydrant && Storage::disk('s3')->exists($inspection->foto_hydrant)) {
            Storage::disk('s3')->delete($inspection->foto_hydrant);
        }

        $inspection->delete();

        return redirect()->route('inspection.hydrant.index')->with('success', 'Inspeksi Hydrant berhasil dihapus.');
    }
    public function rekap(Request $request)
    {
        $bulan = $request->input('bulan', now()->format('m'));
        $tahun = $request->input('tahun', now()->format('Y'));

        $rekap = HydrantInspection::with(['hydrant', 'user.karyawan'])
            ->whereMonth('tanggal_inspeksi', $bulan)
            ->whereYear('tanggal_inspeksi', $tahun)
            ->orderByDesc('tanggal_inspeksi')
            ->get();

        return inertia('Laporan/hydrant-rekap', [
            'rekap' => $rekap,
            'bulan' => $bulan,
            'tahun' => $tahun,
        ]);
    }
    public function exportPdf(Request $request)
    {
        $bulan = $request->input('bulan', now()->format('m'));
        $tahun = $request->input('tahun', now()->format('Y'));

        $rekap = HydrantInspection::with(['hydrant', 'user.karyawan'])
            ->whereMonth('tanggal_inspeksi', $bulan)
            ->whereYear('tanggal_inspeksi', $tahun)
            ->orderByDesc('tanggal_inspeksi')
            ->get();

        $pdf = Pdf::loadView('report.rekap_hydrant', compact('rekap', 'bulan', 'tahun'));
        return $pdf->stream("rekap_hydrant_{$bulan}_{$tahun}.pdf");
    }
}
