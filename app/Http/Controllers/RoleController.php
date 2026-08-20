<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class RoleController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:roles index', only: ['index']),
            new Middleware('permission:roles create', only: ['create', 'store']),
            new Middleware('permission:roles edit', only: ['edit', 'update']),
            new Middleware('permission:roles delete', only: ['destroy']),
        ];
    }

    public function index(Request $request)
    {
        $query = Role::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $roles = Role::with('permissions:id,name')
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('role-management/index', [
            'roles' => $roles,
            'filters' => $request->only('search'),
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('role-management/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:3|max:255|unique:roles,name',
            'permissions' => 'nullable|array',
        ]);

        DB::transaction(function () use ($validated) {
            $role = Role::create(['name' => $validated['name']]);
            
            if (!empty($validated['permissions'])) {
                $role->givePermissionTo($validated['permissions']);
            }
        });

        return redirect()->route('role.index')->with('success', 'Role created successfully.');
    }

    public function edit(Role $role)
    {
        return Inertia::render('role-management/edit', [
            'role' => $role->load('permissions'),
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:3|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'nullable|array',
        ]);

        DB::transaction(function () use ($role, $validated) {
            $role->update(['name' => $validated['name']]);
            
            if (!empty($validated['permissions'])) {
                $role->syncPermissions($validated['permissions']);
            } else {
                $role->permissions()->detach();
            }
        });

        return redirect()->route('role.index')->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role)
    {
        $role->delete();

        return back()->with('success', 'Role deleted successfully.');
    }

    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:roles,id',
        ]);

        Role::whereIn('id', $validated['ids'])->delete();

        return back()->with('success', 'Roles deleted successfully.');
    }
}