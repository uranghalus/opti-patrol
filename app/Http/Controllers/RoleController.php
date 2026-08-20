<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:roles index', only: ['index']),
            new Middleware('permission:roles create', only: ['create', 'store']),
            new Middleware('permission:roles edit', only: ['edit', 'update']),
            new Middleware('permission:roles delete', only: ['destroy', 'bulkDestroy']),
            new Middleware('permission:roles export', only: ['export']),
        ];
    }

    public function index(Request $request)
    {
        $query = Role::query()
            ->withCount('permissions')
            ->with('permissions:id,name')
            ->when($request->filled('search'), function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%");
            })
            ->when($request->filled('guard'), function ($q) use ($request) {
                $q->where('guard_name', $request->guard);
            })
            ->orderBy('name');

        $perPage = $request->input('per_page', 15);
        $roles = $query->paginate($perPage)->withQueryString();

        $guards = Role::select('guard_name')->distinct()->pluck('guard_name');

        return Inertia::render('role-management/Index', [
            'roles' => $roles,
            'filters' => $request->only(['search', 'guard', 'per_page']),
            'guards' => $guards,
        ]);
    }

    public function create()
    {
        $permissions = Permission::orderBy('name')->get(['id', 'name', 'guard_name']);

        $groupedPermissions = $permissions->groupBy(function ($permission) {
            $parts = explode(' ', $permission->name);

            return $parts[0] ?? 'other';
        })->map(function ($group) {
            return $group->map(fn ($p) => ['id' => $p->id, 'name' => $p->name])->values();
        });

        return Inertia::render('role-management/Create', [
            'permissions' => $groupedPermissions,
            'guards' => Permission::select('guard_name')->distinct()->pluck('guard_name'),
        ]);
    }

    public function store(RoleRequest $request)
    {
        $role = Role::create([
            'name' => $request->name,
            'guard_name' => $request->guard_name ?? 'web',
        ]);

        if ($request->filled('permissions')) {
            $permissionNames = Permission::whereIn('id', $request->permissions)->pluck('name');
            $role->givePermissionTo($permissionNames);
        }

        return redirect()->route('role.index')->with('success', 'Role berhasil dibuat.');
    }

    public function edit(Role $role)
    {
        $role->load('permissions');

        $permissions = Permission::orderBy('name')->get(['id', 'name', 'guard_name']);

        $groupedPermissions = $permissions->groupBy(function ($permission) {
            $parts = explode(' ', $permission->name);

            return $parts[0] ?? 'other';
        })->map(function ($group) {
            return $group->map(fn ($p) => ['id' => $p->id, 'name' => $p->name])->values();
        });

        return Inertia::render('role-management/Edit', [
            'role' => $role->load('permissions:id,name'),
            'permissions' => $groupedPermissions,
            'guards' => Permission::select('guard_name')->distinct()->pluck('guard_name'),
        ]);
    }

    public function update(RoleRequest $request, Role $role)
    {
        $role->update([
            'name' => $request->name,
            'guard_name' => $request->guard_name ?? 'web',
        ]);

        if ($request->filled('permissions')) {
            $permissionNames = Permission::whereIn('id', $request->permissions)->pluck('name');
            $role->syncPermissions($permissionNames);
        } else {
            $role->permissions()->detach();
        }

        return redirect()->route('role.index')->with('success', 'Role berhasil diperbarui.');
    }

    public function destroy(Role $role)
    {
        if ($role->name === 'superadmin') {
            return back()->with('error', 'Role superadmin tidak dapat dihapus.');
        }

        $role->delete();

        return back()->with('success', 'Role berhasil dihapus.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:roles,id',
        ]);

        $count = Role::whereIn('id', $request->ids)
            ->where('name', '!=', 'superadmin')
            ->delete();

        return back()->with('success', "{$count} Role berhasil dihapus.");
    }

    public function bulkAssignPermissions(Request $request)
    {
        $request->validate([
            'role_ids' => 'required|array',
            'role_ids.*' => 'exists:roles,id',
            'permission_ids' => 'required|array',
            'permission_ids.*' => 'exists:permissions,id',
            'action' => 'required|in:add,remove',
        ]);

        $permissionNames = Permission::whereIn('id', $request->permission_ids)->pluck('name');
        $roles = Role::whereIn('id', $request->role_ids)->get();

        foreach ($roles as $role) {
            if ($role->name === 'superadmin') {
                continue;
            }

            if ($request->action === 'add') {
                $role->givePermissionTo($permissionNames);
            } else {
                $role->revokePermissionTo($permissionNames);
            }
        }

        return back()->with('success', 'Izin berhasil '.($request->action === 'add' ? 'ditambahkan' : 'dihapus').' ke '.count($roles).' role.');
    }

    public function clone(Role $role)
    {
        $newRole = Role::create([
            'name' => $role->name.' (Copy)',
            'guard_name' => $role->guard_name,
        ]);

        $newRole->syncPermissions($role->permissions->pluck('name'));

        return redirect()->route('role.edit', $newRole)->with('success', 'Role berhasil diduplikasi. Silakan edit nama dan izin sesuai kebutuhan.');
    }

    public function export(Request $request)
    {
        $query = Role::query()
            ->with('permissions:id,name')
            ->when($request->filled('search'), function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%");
            })
            ->when($request->filled('guard'), function ($q) use ($request) {
                $q->where('guard_name', $request->guard);
            })
            ->orderBy('name');

        $roles = $query->get();

        $headers = ['ID', 'Name', 'Guard', 'Permissions Count', 'Permissions', 'Created At', 'Updated At'];
        $rows = $roles->map(function ($role) {
            return [
                $role->id,
                $role->name,
                $role->guard_name,
                $role->permissions_count ?? $role->permissions->count(),
                $role->permissions->pluck('name')->implode(', '),
                $role->created_at?->format('Y-m-d H:i:s'),
                $role->updated_at?->format('Y-m-d H:i:s'),
            ];
        });

        return Inertia::render('role-management/Export', [
            'headers' => $headers,
            'rows' => $rows,
            'filename' => 'roles-export-'.now()->format('Y-m-d'),
        ]);
    }
}
