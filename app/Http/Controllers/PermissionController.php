<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:permission.view', only: ['index']),
            new Middleware('permission:permission.create', only: ['create', 'store']),
            new Middleware('permission:permission.edit', only: ['edit', 'update']),
            new Middleware('permission:permission.delete', only: ['destroy']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $permissions = Permission::all();
        return inertia('role-management/permission/index', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return Inertia::render('role-management/permission/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validated = $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'string|max:255',
            'guard_name' => 'required|string|max:255',
        ]);

        foreach ($validated['permissions'] as $permissionName) {
            Permission::firstOrCreate([
                'name' => $permissionName,
                'guard_name' => $validated['guard_name'],
            ]);
        }
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        //
        $permission = Permission::findOrFail($id);
        return Inertia::render('role-management/permission/Edit', ['permission' => $permission]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
        $permission = Permission::findOrFail($id);
        $request->validate([
            'name' => 'required|unique:permissions,name,' . $permission->id,
        ]);

        $permission->name = $request->name;
        $permission->save();

        return redirect()->route('permission.index')
            ->with('success', 'Permission updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        $permission = Permission::findOrFail($id);
        $permission->delete();
        return back()->with('success', 'Permission deleted.');
    }
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:permissions,id',
        ]);

        Permission::whereIn('id', $request->ids)->delete();

        return back()->with('success', 'Permissions berhasil dihapus.');
    }
}
