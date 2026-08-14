<?php

namespace App\Http\Controllers;

use App\Models\Hydrant;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\View;
use Intervention\Image\Laravel\Facades\Image;
use SimpleSoftwareIO\QrCode\Facades\QrCode;


class HydrantController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:hydrant.view', only: ['index', 'generateQRCode', 'generateMassHydrantQRCode', 'getFilterOptions']),
            new Middleware('permission:hydrant.create', only: ['create', 'store', 'import']),
            new Middleware('permission:hydrant.edit', only: ['edit', 'update']),
            new Middleware('permission:hydrant.delete', only: ['destroy']),
            new Middleware('permission:hydrant.generate-qr', only: ['generateQRCode', 'generateMassHydrantQRCode']),
            new Middleware('permission:hydrant.export', only: ['generateQRCode', 'generateMassHydrantQRCode']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $hydrantdata = Hydrant::with('user.karyawan')->get();
        return Inertia::render('fire-safety/hydrant/index', [
            'hydrantdata' => $hydrantdata,
        ]);
    }

    public function HydrantQRCode($id)
    {
        $apar = Hydrant::findOrFail($id);
        $url = url('/inspection/hydrant-inspeksi/' . $apar->id);

        // Generate QR code binary PNG
        $qrCode = QrCode::format('png')
            ->size(300)
            ->generate($url);

        // Convert to stream
        $tempStream = fopen('php://memory', 'r+');
        fwrite($tempStream, $qrCode);
        rewind($tempStream);

        // Intervention Image V3

        $canvas = Image::create(300, 300)->fill('#ffffff');
        $qr = Image::read($tempStream)->resize(275, 275);
        $canvas->place($qr, 'center', 0, 0);

        // Convert to base64
        $encoded = (string) $canvas->toJpeg(); // or toPng()
        $base64 = 'data:image/jpeg;base64,' . base64_encode($encoded);

        // Generate PDF from Blade
        $pdf = Pdf::loadView('hydrant.qrcode', [
            'kode_hydrant' => $apar->kode_hydrant,
            'qr_base64' => $base64,
        ])->setPaper('A4');

        return $pdf->download("qr_apar_{$apar->kode_apar}.pdf");
    }
    public function generateMassHydrantQRCode(Request $request)
    {
        ini_set('max_execution_time', 120);
        ini_set('memory_limit', '256M');

        $batch = $request->get('batch', 1);
        $lantai = $request->get('lantai');
        $perPage = 30;

        $query = Hydrant::query();
        if ($lantai) $query->where('lantai', $lantai);

        $hydrants = $query
            ->orderBy('id')
            ->skip(($batch - 1) * $perPage)
            ->take($perPage)
            ->get();
        if (!$batch || !is_numeric($batch) || $batch < 1 || $hydrants->isEmpty()) {
            abort(404, 'Data tidak valid untuk dicetak.');
        }
        // Hapus file QR lama dari hydrant dalam batch ini


        // Generate ulang semua QR code
        $hydrants = $hydrants->map(function ($hydrant) {
            $filename = 'qrcodes/hydrant-qr-' . $hydrant->kode_unik . '.png';
            $storagePath = storage_path('app/public/' . $filename);

            $qr = QrCode::format('png')
                ->size(150)
                ->generate(url('/inspection/hydrant-inspeksi/' . $hydrant->id));

            Storage::disk('public')->put($filename, $qr);

            return [
                'kode_unik' => $hydrant->kode_unik,
                'kode_hydrant' => $hydrant->kode_hydrant,
                'lantai' => $hydrant->lantai,
                'lokasi' => $hydrant->lokasi,
                'qr_base64' => 'data:image/png;base64,' . base64_encode(file_get_contents($storagePath)),
            ];
        });

        $html = View::make('hydrant.qrexports_pdf', [
            'hydrants' => $hydrants,
            'batch' => $batch,
            'lantai' => $lantai
        ])->render();

        $pdf = Pdf::loadHTML($html)->setPaper('a4', 'portrait');

        return $pdf->download('qr-code-hydrant-batch-' . $batch . '.pdf');
        foreach ($hydrants as $hydrant) {
            $filename = 'qrcodes/hydrant-qr-' . $hydrant->kode_unik . '.png';
            $storagePath = storage_path('app/public/' . $filename);

            if (file_exists($storagePath)) {
                unlink($storagePath);
            }
        }
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validated = $request->validate([
            'kode_unik' => 'required|string|max:255|unique:hydrant,kode_unik',
            'kode_hydrant' => 'required|string|max:255|unique:hydrant,kode_hydrant',
            'tipe' => 'required|in:Indoor,Outdoor',
            'lokasi' => 'required|string|max:255',
            'user_id' => 'nullable|exists:users,id',
        ]);
        $user = Auth::user();

        $validated['user_id'] = $user->id;
        Hydrant::create($validated);

        return redirect()->route('hydrant.index')->with('success', 'Hydrant berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $hydrant = Hydrant::findOrFail($id);
        //
        $validated = $request->validate([
            'kode_unik' => 'required|string|max:255|unique:hydrant,kode_unik,' . $hydrant->id,
            'kode_hydrant' => 'required|string|max:255|unique:hydrant,kode_hydrant,' . $hydrant->id,
            'tipe' => 'required|in:Indoor,Outdoor',
            'lokasi' => 'required|string|max:255',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $hydrant->update($validated);

        return redirect()->route('hydrant.index')->with('success', 'Hydrant berhasil diupdate.');
    }
    public function showUploadForm()
    {
        return Inertia::render('fire-safety/hydrant/UploadExcel');
    }


    public function import(Request $request)
    {
        $hydrants = $request->input('data', []);

        $validator = Validator::make(['data' => $hydrants], [
            'data.*.kode_unik' => 'required|string|distinct',
            'data.*.kode_hydrant' => 'required|string|distinct',
            'data.*.ukuran' => 'required|string',
            'data.*.lantai' => 'nullable|string',
            'data.*.lokasi' => 'required|string',
        ]);

        if ($validator->fails()) {
            Log::error('Import validation failed', $validator->errors()->toArray());
            return back()->withErrors($validator);
        }

        foreach ($hydrants as $row) {
            Hydrant::updateOrCreate(
                ['kode_unik' => $row['kode_unik']],
                [
                    'kode_hydrant' => $row['kode_hydrant'],
                    'ukuran' => $row['ukuran'],
                    'lantai' => $row['lantai'] ?? null,
                    'lokasi' => $row['lokasi'],
                    'user_id' => Auth::user()->id,
                ]
            );
        }

        return redirect()->route('hydrant.index')->with('success', 'Import berhasil!');
    }
    public function getFilterOptions()
    {
        $lantai = Hydrant::select('lantai')
            ->distinct()
            ->whereNotNull('lantai')
            ->where('lantai', '!=', '')
            ->pluck('lantai');

        $total = Hydrant::count();
        $perPage = 30;
        $totalBatch = ceil($total / $perPage);

        return response()->json([
            'lantai' => $lantai,
            'totalBatch' => $totalBatch,
        ]);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        $hydrant = Hydrant::findOrFail($id);
        $hydrant->delete();

        return redirect()->route('hydrant.index')->with('success', 'Hydrant berhasil dihapus.');
    }
}
