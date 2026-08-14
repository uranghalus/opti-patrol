<?php

namespace App\Http\Controllers;

use App\Models\CPInspection;
use App\Models\CekPointSecurity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Intervention\Image\Laravel\Facades\Image;

class CPSecurityInspectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $inspections = CPInspection::with(['cekPoint', 'user.karyawan'])->latest()->get();
        return Inertia::render('cekpoint/Index', [
            'inspections' => $inspections,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $cekPoints = CekPointSecurity::all();
        return Inertia::render('cekpoint/Create', [
            'cekpoints' => $cekPoints,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        ini_set('max_execution_time', 120);
        ini_set('memory_limit', '256M');

        $validated = $request->validate([
            'kode_cp' => ['required', 'exists:cek_point_security,id'],
            'regu'    => ['required', Rule::in(['PAGI', 'SIANG', 'MALAM', 'MIDDLE'])],
            'kondisi' => ['nullable', 'string', 'max:150'],
            'nama_petugas' => ['required', 'string', 'max:150'],
            'bocoran' => ['nullable', 'string', 'max:150'],
            'penerangan_lampu' => ['nullable', 'string', 'max:150'],
            'kerusakan_fasum' => ['nullable', 'string', 'max:150'],
            'potensi_bahaya_api' => ['nullable', 'string', 'max:150'],
            'potensi_bahaya_keorang' => ['nullable', 'string', 'max:150'],
            'orang_mencurigakan' => ['nullable', 'string', 'max:150'],
        ]);

        $validated['user_id'] = Auth::id();

        $fotoFields = [
            'foto_kondisi',
            'foto_bocoran',
            'foto_penerangan_lampu',
            'foto_kerusakan_fasum',
            'foto_potensi_bahaya_api',
            'foto_potensi_bahaya_keorang',
            'foto_orang_mencurigakan',
        ];

        foreach ($fotoFields as $field) {
            $value = $request->$field ?? null;

            if (!$value) continue;

            // --- CASE 1: base64 dari Android/web ---
            if (is_string($value) && Str::startsWith($value, 'data:image/')) {
                $imageData = explode(',', $value)[1];
                $decoded = base64_decode($imageData);
                $image = Image::read($decoded);

                if ($image->width() > 1200) {
                    $image->resize(1200, null);
                }

                $compressed = $image->toJpeg(75);
                $path = "inspection/cekpoint/{$field}_" . time() . ".jpg";
                Storage::disk('s3')->put($path, (string) $compressed);

                $validated[$field] = $path;
            }

            // --- CASE 2: File upload dari iPhone ---
            elseif ($request->hasFile($field)) {
                $file = $request->file($field);
                $path = $file->storeAs(
                    'inspection/cekpoint',
                    "{$field}_" . time() . '.' . $file->getClientOriginalExtension(),
                    's3'
                );
                $validated[$field] = $path;
            }
        }

        CPInspection::create($validated);

        return redirect()->route('inspection.cp-security.index')
            ->with('success', 'Inspeksi Cekpoint Security berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $inspection = CPInspection::with(['cekPoint', 'user.karyawan'])->findOrFail($id);
        return Inertia::render('cekpoint/Show', [
            'inspection' => $inspection,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $inspection = CPInspection::with(['cekPoint', 'user.karyawan'])->findOrFail($id);
        $cekPoints = CekPointSecurity::all();
        return Inertia::render('cekpoint/Edit', [
            'inspection' => $inspection,
            'cekPoints' => $cekPoints,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $inspection = CPInspection::findOrFail($id);

        $validated = $request->validate([
            'kode_cp' => ['required', 'exists:cek_point_security,id'],
            'regu'    => ['required', 'in:PAGI,SIANG,MALAM,MIDDLE'],
            'kondisi' => ['nullable', 'string', 'max:150'],
            'foto_kondisi' => ['nullable', 'string'],
            'bocoran' => ['nullable', 'string', 'max:150'],
            'foto_bocoran' => ['nullable', 'string'],
            'penerangan_lampu' => ['nullable', 'string', 'max:150'],
            'foto_penerangan_lampu' => ['nullable', 'string'],
            'kerusakan_fasum' => ['nullable', 'string', 'max:150'],
            'foto_kerusakan_fasum' => ['nullable', 'string'],
            'potensi_bahaya_api' => ['nullable', 'string', 'max:150'],
            'foto_potensi_bahaya_api' => ['nullable', 'string'],
            'potensi_bahaya_keorang' => ['nullable', 'string', 'max:150'],
            'foto_potensi_bahaya_keorang' => ['nullable', 'string'],
            'orang_mencurigakan' => ['nullable', 'string', 'max:150'],
            'foto_orang_mencurigakan' => ['nullable', 'string'],
            'tanggal_patroli' => ['nullable', 'date'],
        ]);

        $validated['user_id'] = Auth::id();

        // foto fields
        foreach (
            [
                'foto_kondisi',
                'foto_bocoran',
                'foto_penerangan_lampu',
                'foto_kerusakan_fasum',
                'foto_potensi_bahaya_api',
                'foto_potensi_bahaya_keorang',
                'foto_orang_mencurigakan',
            ] as $fotoField
        ) {
            if ($request->filled($fotoField) && Str::startsWith($request->$fotoField, 'data:image/')) {
                $imageData = explode(',', $request->$fotoField)[1];
                $decodedImage = base64_decode($imageData);
                $image = Image::read($decodedImage);

                if ($image->width() > 1200) {
                    $image->resize(1200, null);
                }

                $compressed = $image->toJpeg(75);
                $path = "inspection/cekpoint/{$fotoField}_" . time() . ".jpg";
                Storage::disk('s3')->put($path, (string) $compressed);
                $validated[$fotoField] = $path;
            } else {
                // jika tidak upload baru → tetap pakai foto lama
                unset($validated[$fotoField]);
            }
        }


        $inspection->update($validated);

        return redirect()->route('inspection.cp-security.index')->with('success', 'Inspeksi Cekpoint Security berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $inspection = CPInspection::findOrFail($id);

        // Delete images from S3
        foreach (
            [
                'foto_kondisi',
                'foto_bocoran',
                'foto_penerangan_lampu',
                'foto_kerusakan_fasum',
                'foto_potensi_bahaya_api',
                'foto_potensi_bahaya_keorang',
                'foto_orang_mencurigakan'
            ] as $fotoField
        ) {
            if ($inspection->$fotoField && Storage::disk('s3')->exists($inspection->$fotoField)) {
                Storage::disk('s3')->delete($inspection->$fotoField);
            }
        }

        $inspection->delete();

        return redirect()->route('inspection.cp-security.index')->with('success', 'Inspeksi Cekpoint Security berhasil dihapus.');
    }

    public function rekap(Request $request)
    {
        $bulan = $request->input('bulan', now()->format('m'));
        $tahun = $request->input('tahun', now()->format('Y'));

        $rekap = CPInspection::with(['user']) // sesuaikan relasi jika ada
            ->whereMonth('tanggal_patroli', $bulan)
            ->whereYear('tanggal_patroli', $tahun)
            ->orderByDesc('tanggal_patroli')
            ->get();

        return inertia('Laporan/cekpoint-rekap', [
            'rekap' => $rekap,
            'bulan' => $bulan,
            'tahun' => $tahun,
        ]);
    }

    // Export PDF (streaming) - memory friendly
    public function exportPdf(Request $request)
    {
        $bulan = $request->input('bulan', now()->format('m'));
        $tahun = $request->input('tahun', now()->format('Y'));

        $rekap = CPInspection::with(['user']) // sesuaikan relasi jika ada
            ->whereMonth('tanggal_patroli', $bulan)
            ->whereYear('tanggal_patroli', $tahun)
            ->orderByDesc('tanggal_patroli')
            ->get();

        $pdf = Pdf::loadView('report.rekap_cekpoint', compact('rekap', 'bulan', 'tahun'));

        return $pdf->stream("rekap_cp_{$bulan}_{$tahun}.pdf");
    }
    // Print-friendly view (opens a simple HTML page suitable for window.print)
    public function print(Request $request)
    {
        // reuse the same logic as index but without pagination (careful with size)
        $type = $request->get('type', 'week');
        $date = $request->get('date');

        $query = CPInspection::query()->select([
            'kode_cp',
            'nama_petugas',
            'regu',
            'kondisi',
            'tanggal_patroli'
        ]);

        if ($type === 'week') {
            $ref = $date ? Carbon::parse($date) : Carbon::now();
            $start = $ref->startOfWeek()->toDateString();
            $end = $ref->endOfWeek()->toDateString();
            $query->whereBetween('tanggal_patroli', [$start, $end]);
        } else {
            $ref = $date ? Carbon::parse($date) : Carbon::now();
            $start = $ref->copy()->startOfMonth()->toDateString();
            $end = $ref->copy()->endOfMonth()->toDateString();
            $query->whereBetween('tanggal_patroli', [$start, $end]);
        }

        // Use cursor if expecting many rows. But for print maybe limit or warn user.
        $rows = $query->orderBy('tanggal_patroli', 'desc')->limit(1000)->get();

        return view('reports.print', [
            'rows' => $rows,
        ]);
    }
}
