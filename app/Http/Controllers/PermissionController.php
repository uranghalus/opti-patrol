<?php

namespace App\Http\Controllers;

use App\Http\Requests\PermissionRequest;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:permissions index', only: ['index']),
            new Middleware('permission:permissions create', only: ['create', 'store']),
            new Middleware('permission:permissions edit', only: ['edit', 'update']),
            new Middleware('permission:permissions delete', only: ['destroy', 'bulkDestroy']),
            new Middleware('permission:permissions export', only: ['export']),
        ];
    }

    public function index(Request $request)
    {
        $query = Permission::query()
            ->withCount('roles')
            ->when($request->filled('search'), function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%");
            })
            ->when($request->filled('guard'), function ($q) use ($request) {
                $q->where('guard_name', $request->guard);
            })
            ->when($request->filled('group'), function ($q) use ($request) {
                $group = $request->group;
                $q->where('name', 'like', "{$group} %")
                    ->orWhere('name', $group);
            })
            ->orderBy('name');

        $perPage = $request->input('per_page', 20);
        $permissions = $query->paginate($perPage)->withQueryString();

        $guards = Permission::select('guard_name')->distinct()->pluck('guard_name');

        $groups = Permission::get()
            ->map(function ($p) {
                $parts = explode(' ', $p->name);

                return $parts[0] ?? 'other';
            })
            ->unique()
            ->values();

        return Inertia::render('permission-management/Index', [
            'permissions' => $permissions,
            'filters' => $request->only(['search', 'guard', 'group', 'per_page']),
            'guards' => $guards,
            'groups' => $groups,
        ]);
    }

    public function create()
    {
        return Inertia::render('permission-management/Create', [
            'guards' => ['web', 'api'],
        ]);
    }

    public function store(PermissionRequest $request)
    {
        $permissions = [];
        foreach ($request->names as $name) {
            $permissions[] = Permission::firstOrCreate([
                'name' => trim($name),
                'guard_name' => $request->guard_name,
            ]);
        }

        return redirect()->route('permission.index')->with('success', count($permissions).' Permission berhasil dibuat.');
    }

    public function edit(Permission $permission)
    {
        return Inertia::render('permission-management/Edit', [
            'permission' => $permission,
            'guards' => ['web', 'api'],
        ]);
    }

    public function update(PermissionRequest $request, Permission $permission)
    {
        $permission->update([
            'name' => $request->name,
            'guard_name' => $request->guard_name,
        ]);

        return redirect()->route('permission.index')->with('success', 'Permission berhasil diperbarui.');
    }

    public function destroy(Permission $permission)
    {
        $permission->delete();

        return back()->with('success', 'Permission berhasil dihapus.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:permissions,id',
        ]);

        $count = Permission::whereIn('id', $request->ids)->delete();

        return back()->with('success', "{$count} Permission berhasil dihapus.");
    }

    public function export(Request $request)
    {
        $query = Permission::query()
            ->withCount('roles')
            ->when($request->filled('search'), function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%");
            })
            ->when($request->filled('guard'), function ($q) use ($request) {
                $q->where('guard_name', $request->guard);
            })
            ->orderBy('name');

        $permissions = $query->get();

        $headers = ['ID', 'Name', 'Guard', 'Roles Count', 'Created At', 'Updated At'];
        $rows = $permissions->map(function ($permission) {
            return [
                $permission->id,
                $permission->name,
                $permission->guard_name,
                $permission->roles_count,
                $permission->created_at?->format('Y-m-d H:i:s'),
                $permission->updated_at?->format('Y-m-d H:i:s'),
            ];
        });

        return Inertia::render('permission-management/Export', [
            'headers' => $headers,
            'rows' => $rows,
            'filename' => 'permissions-export-'.now()->format('Y-m-d'),
        ]);
    }
}
