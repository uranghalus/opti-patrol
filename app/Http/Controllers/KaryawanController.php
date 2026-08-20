<?php

namespace App\Http\Controllers;

use App\Models\Departments;
use App\Models\Jabatan;
use App\Models\Karyawan;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Intervention\Image\Laravel\Facades\Image;

class KaryawanController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:karyawan.view', only: ['index', 'show']),
            new Middleware('permission:karyawan.create', only: ['create', 'store']),
            new Middleware('permission:karyawan.edit', only: ['edit', 'update']),
            new Middleware('permission:karyawan.delete', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $karyawans = Karyawan::with(['department', 'jabatan'])->latest()->get();
        $departments = Departments::all(['id', 'name']);
        $jabatan = Jabatan::all();

        return Inertia::render('master/karyawan/index', [
            'karyawans' => $karyawans,
            'departments' => $departments,
            'jabatans' => $jabatan,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        $departments = Departments::all(['id', 'name']);
        $jabatan = Jabatan::all();

        return Inertia::render('master/karyawan/Create', [
            'departments' => $departments,
            'jabatans' => $jabatan,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validated = $request->validate([
            'nik' => 'required|string|max:255|unique:tbl_karyawans,nik',
            'no_ktp' => 'nullable|string|max:16|unique:tbl_karyawans,no_ktp',
            'nama' => 'required|string|max:255',
            'nama_alias' => 'nullable|string|max:255',
            'gender' => 'required|in:L,P',
            'alamat' => 'nullable|string|max:255',
            'department_id' => 'required|exists:tbl_departments,id',
            'jabatan_id' => 'nullable|exists:tbl_jabatan,id',
            'status_karyawan' => 'nullable|in:aktif,tidak_aktif,cuti,resign',
            'tmk' => 'nullable|date',
            'call_sign' => 'nullable|string|max:255',
            'keterangan' => 'nullable|string|max:255',
            'telp' => 'nullable|string|max:255',
            'user_image' => 'nullable|image|max:2048', // max 2MB
        ]);

        // Simpan file jika ada
        if ($request->hasFile('user_image')) {
            $filename = uniqid().'.webp';
            $path = "uploads/karyawan/{$filename}";

            $convertedImage = Image::read($request->file('user_image'))->toWebp(80);
            Storage::disk('public')->put($path, (string) $convertedImage);
            $validated['user_image'] = $path; // Simpan path ke database
        }

        Karyawan::create($validated);

        // return redirect()->route('karyawan.index')->with('success', 'Karyawan berhasil ditambahkan.');

        return redirect()->back()->with('success', 'Karyawan created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
        $karyawan = Karyawan::with(['department', 'jabatan'])->findOrFail($id);
        if (! $karyawan) {
            return redirect()->back()->with('error', 'Karyawan not found.');
        }

        return Inertia::render('master/karyawan/Show', [
            'karyawan' => $karyawan,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $karyawan = Karyawan::with(['department', 'jabatan'])->findOrFail($id);
        if (! $karyawan) {
            return redirect()->back()->with('error', 'Karyawan not found.');
        }
        //
        $departments = Departments::all(['id', 'name']);
        $jabatan = Jabatan::all();

        return Inertia::render('master/karyawan/Edit', [
            'karyawan' => $karyawan,
            'departments' => $departments,
            'jabatans' => $jabatan,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $karyawan = Karyawan::findOrFail($id);

        // Validasi data
        $validatedData = $request->validate([
            'nik' => 'required|string|max:20|unique:tbl_karyawans,nik,'.$karyawan->id_karyawan.',id_karyawan',
            'nama' => 'required|string|max:100',
            'nama_alias' => 'nullable|string|max:100',
            'gender' => 'required|string|max:10',
            'alamat' => 'nullable|string|max:255',
            'no_ktp' => 'nullable|string|max:20',
            'telp' => 'nullable|string|max:15',
            'department_id' => 'required|exists:tbl_departments,id',
            'jabatan_id' => 'nullable|exists:tbl_jabatan,id',
            'call_sign' => 'nullable|string|max:50',
            'tmk' => 'nullable|date',
            'status_karyawan' => 'required|string|max:50',
            'keterangan' => 'nullable|string|max:255',
            'user_image' => 'nullable|image|max:2048', // max 2MB
        ]);

        // Jika ada file baru yang diunggah, hapus file lama dan simpan file baru
        if ($request->hasFile('user_image')) {
            // Hapus file lama jika ada
            if ($karyawan->user_image && Storage::disk('public')->exists($karyawan->user_image)) {
                Storage::disk('public')->delete($karyawan->user_image);
            }

            // Simpan file baru
            $filename = uniqid().'.webp';
            $path = "uploads/karyawan/{$filename}";

            $convertedImage = Image::read($request->file('user_image'))->toWebp(80);
            Storage::disk('public')->put($path, (string) $convertedImage);
            $validatedData['user_image'] = $path;
        }

        // Update data karyawan
        $karyawan->update($validatedData);

        return redirect()->route('karyawan.index')->with('success', 'Data karyawan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $karyawan = Karyawan::findOrFail($id);
        if (! $karyawan) {
            return redirect()->back()->with('error', 'Karyawan not found.');
        }
        if ($karyawan->user_image && Storage::disk('public')->exists($karyawan->user_image)) {
            Storage::disk('public')->delete($karyawan->user_image);
        }
        $karyawan->delete();

        return redirect()->back()->with('success', 'Karyawan deleted successfully.');
    }
}
