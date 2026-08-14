<?php

namespace App\Http\Controllers;

use App\Models\Karyawan;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $user = User::with(['karyawan.jabatan', 'roles'])->get();
        return Inertia::render('master/user/Index', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        $karyawans = Karyawan::with('jabatan')->get();
        return Inertia::render('master/user/Create', [
            'karyawans' => $karyawans,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        // Validasi input
        $validated = $request->validate([
            'karyawan_id' => 'required|exists:tbl_karyawans,id_karyawan|unique:users,karyawan_id',
        ]);

        // Ambil data karyawan
        $karyawan = Karyawan::with('jabatan')->findOrFail($validated['karyawan_id']);

        // Validasi tambahan jika no_ktp kosong
        if (!$karyawan->no_ktp) {
            return back()->withErrors(['karyawan_id' => 'Karyawan belum memiliki nomor KTP.']);
        }

        // Buat user baru
        $user = User::create([
            'karyawan_id' => $karyawan->id_karyawan,
            'email' => $this->generateEmailFromKaryawan($karyawan), // bisa custom sesuai kebutuhan
            'password' => strtolower(str_replace(' ', '', $karyawan->nama)),
        ]);

        if (!empty($karyawan->jabatan->roles)) {
            $user->assignRole($karyawan->jabatan->roles);
        }

        return redirect()->route('pengguna.index')->with('success', 'User berhasil dibuat.');
    }
    private function generateEmailFromKaryawan($karyawan): string
    {
        // Bisa ubah jadi lebih kompleks sesuai aturan email perusahaan
        return strtolower(str_replace(' ', '_', $karyawan->nama)) . '@appdutamall.com';
    }
    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        //
        $user = User::with(['karyawan.jabatan'])->findOrFail($id);
        $karyawans = Karyawan::with('jabatan')->get();
        return Inertia::render('master/user/Edit', [
            'user' => $user,
            'karyawans' => $karyawans,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'email' => 'required|email|unique:users,email,' . $user->id,
            'karyawan_id' => 'required|exists:tbl_karyawans,id_karyawan',
            // validasi lain jika perlu
        ]);

        $user->update([
            'email' => $validated['email'],
            'karyawan_id' => $validated['karyawan_id'],
            // update password jika ada
        ]);

        return redirect()->route('pengguna.index')->with('success', 'User berhasil diupdate.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->route('pengguna.index')->with('success', 'User berhasil dihapus.');
    }
}
