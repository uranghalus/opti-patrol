<?php

namespace App\Http\Controllers;

use App\Models\Apar;
use App\Models\AparInspection;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\Laravel\Facades\Image;
use Intervention\Image\Encoders\JpegEncoder;

class AparInspectionController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:apar-inspection.view', only: ['index', 'rekap', 'exportPdf']),
            new Middleware('permission:apar-inspection.create', only: ['create', 'store']),
            new Middleware('permission:apar-inspection.edit', only: ['edit', 'update']),
            new Middleware('permission:apar-inspection.delete', only: ['destroy']),
            new Middleware('permission:apar-inspection.export', only: ['exportPdf']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $aparInspections = AparInspection::with(['apar', 'user.karyawan'])->get();
        return Inertia::render('fire-safety/inspection/apar/index', [
            'aparInspections' => $aparInspections,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        $AparData = Apar::all();
        return Inertia::render('fire-safety/inspection/apar/Create', [
            'aparData' => $AparData,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'apar_id'            => ['required', 'exists:apar,id'],
                'regu'               => ['required', 'in:PAGI,MIDDLE,SIANG,MALAM'],
                'tanggal_kadaluarsa' => ['required', 'date'],
                'tanggal_refill'     => ['required', 'date'],
                'kondisi'            => ['required', 'string', 'max:150'],
                'catatan'            => ['nullable', 'string'],
                'nama_petugas'       => ['required', 'string', 'max:150'],
                'foto_apar'          => ['required'], // file OR base64
            ]);

            $validated['regu'] = str_replace('REGU ', 'Regu ', $validated['regu']);
            $validated['user_id'] = Auth::id();

            $finalPath = null;

            // CASE 1 — FILE UPLOAD
            if ($request->hasFile('foto_apar')) {

                $request->validate([
                    'foto_apar' => ['image', 'mimes:jpg,jpeg,png', 'max:4096'],
                ]);

                $image = Image::read($request->file('foto_apar'));

                $filename = 'apar-' . time() . '-' . Str::random(5) . '.jpg';
                $path = "inspection/apar/{$filename}";
                $uploadedFile = $image->toJpeg(75);
                Storage::disk('s3')->put($path, $uploadedFile);


                $finalPath = $path;
            }

            // CASE 2 — BASE64
            else if (Str::startsWith($request->foto_apar, 'data:image')) {

                $data = explode(',', $request->foto_apar)[1];
                $decoded = base64_decode($data);

                $image = Image::read($decoded);

                $filename = 'apar-' . time() . '-' . Str::random(5) . '.jpg';
                $path = "inspection/apar/{$filename}";

                $compressed = $image->toJpeg(75);
                Storage::disk('s3')->put($path, $compressed);

                $finalPath = $path;
            }

            // INVALID
            else {
                return back()->withErrors(['foto_apar' => 'Foto tidak valid']);
            }

            $validated['foto_apar'] = $finalPath;

            AparInspection::create($validated);

            return redirect()->route('inspection.apar.index')
                ->with('success', 'Data berhasil ditambahkan!');
        } catch (\Exception $e) {

            Log::error('APAR Upload Failed', [
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
        $inspection = AparInspection::with(['apar', 'user.karyawan'])->findOrFail($id);
        if (!$inspection) {
            return redirect()->back()->with('error', 'Data not found.');
        }

        return Inertia::render('fire-safety/inspection/apar/Show', [
            'aparData' => $inspection->append('foto_apar_url')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        //
        $inspection = AparInspection::with(['apar', 'user.karyawan'])->findOrFail($id);
        $aparData = Apar::all(['id', 'kode_apar', 'lokasi']);

        return Inertia::render('fire-safety/inspection/apar/Edit', [
            'aparInspection' => $inspection->append('foto_apar_url'),
            'aparData' => $aparData,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $inspection = AparInspection::findOrFail($id);
        $fileName = 'inspeksi_' . time() . '.jpg';

        $validated = $request->validate([
            'apar_id'            => ['required', 'exists:apar,id'],
            'regu'               => ['required', 'in:PAGI, MIDDLE, SIANG, MALAM'],
            'tanggal_kadaluarsa' => ['required', 'date'],
            'tanggal_refill'     => ['required', 'date'],
            'kondisi'            => ['required', 'string', 'max:150'],
            'catatan'            => ['required', 'string'],
            'foto_apar'          => ['nullable', function ($attribute, $value, $fail) {
                if ($value && !Str::startsWith($value, 'data:image')) {
                    $fail('The ' . $attribute . ' must be a valid base64 image.');
                }
            }],
        ]);

        // Format regu
        $validated['regu'] = str_replace('REGU ', 'Regu ', $validated['regu']);
        $validated['user_id'] = Auth::id();

        // === Jika ada foto baru ===
        if ($request->filled('foto_apar') && Str::startsWith($request->foto_apar, 'data:image/')) {
            $imageData = explode(',', $request->foto_apar)[1];
            $decodedImage = base64_decode($imageData);

            // Kompres dengan Intervention
            $image = Image::read($decodedImage);

            if ($image->width() > 1200) {
                $image->resize(1200, null);
            }

            $compressed = $image->toJpeg(75);
            $path = "inspection/apar/{$fileName}";
            Storage::disk('s3')->put($path, (string) $compressed);

            // Hapus foto lama
            if ($inspection->foto_apar && Storage::disk('s3')->exists($inspection->foto_apar)) {
                Storage::disk('s3')->delete($inspection->foto_apar);
            }

            $validated['foto_apar'] = $path;
        }

        $inspection->update($validated);

        return redirect()->route('inspection.apar.index')->with('success', 'Data berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $inspection = AparInspection::findOrFail($id);

        // Hapus foto dari S3 jika ada
        if ($inspection->foto_apar && Storage::disk('s3')->exists($inspection->foto_apar)) {
            Storage::disk('s3')->delete($inspection->foto_apar);
        }

        // Hapus data dari database
        $inspection->delete();

        return redirect()->route('inspection.apar.index')->with('success', 'Data berhasil dihapus!');
    }
    public function rekap(Request $request)
    {
        $bulan = $request->input('bulan', now()->format('m'));
        $tahun = $request->input('tahun', now()->format('Y'));
        $rekap = AparInspection::with(['apar', 'user.karyawan'])
            ->whereMonth('tanggal_inspeksi', $bulan)
            ->whereYear('tanggal_inspeksi', $tahun)
            ->orderByDesc('tanggal_inspeksi')
            ->get();
        return Inertia::render('Laporan/apar-rekap', [
            'rekap' => $rekap,
            'bulan' => $bulan,
            'tahun' => $tahun,
        ]);
    }
    public function exportPdf(Request $request)
    {
        $bulan = $request->input('bulan', now()->format('m'));
        $tahun = $request->input('tahun', now()->format('Y'));

        $rekap = AparInspection::with(['apar', 'user.karyawan'])
            ->whereMonth('tanggal_inspeksi', $bulan)
            ->whereYear('tanggal_inspeksi', $tahun)
            ->orderByDesc('tanggal_inspeksi')
            ->get();

        $pdf = Pdf::loadView('report.rekap_apar', compact('rekap', 'bulan', 'tahun'));
        return $pdf->stream("rekap_apar_{$bulan}_{$tahun}.pdf");
    }
}
