<?php

namespace App\Http\Controllers;

use App\Models\Jabatan;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class JabatanController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:jabatan.view', only: ['index']),
            new Middleware('permission:jabatan.create', only: ['create', 'store']),
            new Middleware('permission:jabatan.edit', only: ['edit', 'update']),
            new Middleware('permission:jabatan.delete', only: ['destroy']),
        ];
    }
    public function index()
    {
        $jabatans = Jabatan::all();

        return Inertia::render('master/jabatan/Index', [
            'jabatans' => $jabatans
        ]);
    }
    public function create()
    {

        return Inertia::render('master/jabatan/Create', [
            'roles' => Role::pluck('name'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_jabatan' => 'required|string|max:255',
            'roles' => 'nullable|array',
            'roles.*' => 'string|exists:roles,name'
        ]);
        $jabatan = Jabatan::create([
            'nama_jabatan' => $validated['nama_jabatan'],
            'roles'        => $validated['roles'] ?? [],
        ]);
        return redirect()->back()->with('success', 'Jabatan created successfully.');
    }

    public function show($id)
    {
        $jabatan = Jabatan::with('department')->findOrFail($id);
        return Inertia::render('Jabatan/Show', [
            'jabatan' => $jabatan
        ]);
    }
    public function edit($id)
    {
        $jabatan = Jabatan::findOrFail($id);
        return Inertia::render('master/jabatan/Edit', [
            'jabatan' => $jabatan,
        ]);
    }

    public function update(Request $request, $id)
    {
        $jabatan = Jabatan::findOrFail($id);
        $validated = $request->validate([
            'nama_jabatan' => 'sometimes|required|string|max:255',
        ]);
        $jabatan->update($validated);
        return redirect()->back()->with('success', 'Jabatan updated successfully.');
    }

    public function destroy($id)
    {
        $jabatan = Jabatan::findOrFail($id);
        $jabatan->delete();
        return redirect()->back()->with('success', 'Jabatan deleted successfully.');
    }
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:permissions,id',
        ]);

        Jabatan::whereIn('id', $request->ids)->delete();

        return back()->with('success', 'Jabatan berhasil dihapus.');
    }
}
