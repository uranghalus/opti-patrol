<?php

namespace App\Http\Controllers;

use App\Models\Departments;
use App\Models\Office;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class DepartmentController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:department.view', only: ['index']),
            new Middleware('permission:department.create', only: ['create', 'store']),
            new Middleware('permission:department.edit', only: ['edit', 'update']),
            new Middleware('permission:department.delete', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $departments = Departments::with('office:id,office_code,name,address')->latest()->get();
        // Ambil data offices untuk dropdown

        return Inertia::render('master/departments/index', [
            'departments' => $departments,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        $offices = Office::all();

        return Inertia::render('master/departments/Create', [
            'offices' => $offices,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validated = $request->validate([
            'department_code' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'office_id' => 'required|exists:tbl_offices,id',
        ]);

        Departments::create($validated);

        return redirect()->back()->with('success', 'Department created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Departments $departments)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        //
        $departments = Departments::find($id);
        $offices = Office::all();

        return Inertia::render('master/departments/Edit', [
            'department' => $departments,
            'offices' => $offices,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $departments = Departments::findOrFail($id);
        if (! $departments) {
            return redirect()->back()->with('error', 'Department not found.');
        }
        //
        $validated = $request->validate([
            'department_code' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'office_id' => 'required|exists:tbl_offices,id',
        ]);

        $departments->update($validated);

        return redirect()->back()->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $departments = Departments::findOrFail($id);
        if (! $departments) {
            return redirect()->back()->with('error', 'Department not found.');
        }
        $departments->delete();

        return redirect()->back()->with('success', 'Department deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:permissions,id',
        ]);

        Departments::whereIn('id', $request->ids)->delete();

        return back()->with('success', 'Department berhasil dihapus.');
    }
}
