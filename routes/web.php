<?php

use App\Http\Controllers\AparController;
use App\Http\Controllers\AparInspectionController;
use App\Http\Controllers\Auth\OIDCController;
use App\Http\Controllers\CekpointSecurityController;
use App\Http\Controllers\CPSecurityInspectionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\HydrantController;
use App\Http\Controllers\HydrantInspectionController;
use App\Http\Controllers\InspectionController;
use App\Http\Controllers\JabatanController;
use App\Http\Controllers\KaryawanController;
use App\Http\Controllers\OfficesController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/auth/redirect')->name('home');

Route::get('auth/redirect', [OIDCController::class, 'redirect'])->name('authsso');
Route::get('auth/oidc/callback', [OIDCController::class, 'callback'])->name('ssocallback');
Route::get('auth/error', function () {
    $message = session('error', 'Terjadi kesalahan saat login SSO.');

    return response("<h1>Login Gagal</h1><p>{$message}</p><p><a href='/auth/redirect'>Coba lagi</a></p>", 500)
        ->header('Content-Type', 'text/html');
})->name('auth.error');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::inertia('inspection', 'inspection/index')->name('inspection');

    // Role Management
    Route::prefix('role-management')->name('role.')->group(function () {
        Route::resource('/', RoleController::class)->except(['show']);
        Route::delete('/bulk-delete', [RoleController::class, 'bulkDestroy'])->name('bulk-destroy');
        Route::post('/bulk-assign-permissions', [RoleController::class, 'bulkAssignPermissions'])->name('bulk-assign-permissions');
        Route::post('/{role}/clone', [RoleController::class, 'clone'])->name('clone');
        Route::get('/export', [RoleController::class, 'export'])->name('export');
    });

    // Permission Management
    Route::prefix('permission-management')->name('permission.')->group(function () {
        Route::resource('/', PermissionController::class)->except(['show']);
        Route::post('/bulk-delete', [PermissionController::class, 'bulkDestroy'])->name('bulk-destroy');
        Route::get('/export', [PermissionController::class, 'export'])->name('export');
    });

    // Fire Safety Master Data
    Route::prefix('fire-safety')->name('apar.')->group(function () {
        Route::resource('apar', AparController::class)->parameters(['apar' => 'id'])->names('apar');
        Route::get('/apar/{id}/generate-qr', [AparController::class, 'generateQRCode'])->name('generateQRCode');
        Route::get('/apar/generate-mass-qr', [AparController::class, 'generateMassQRCode'])->name('generateMassQRCode');
        Route::get('/apar/upload-excel', [AparController::class, 'showUploadForm'])->name('uploadExcel');
        Route::post('/apar/import', [AparController::class, 'import'])->name('import');
        Route::get('/apar/filter-options', [AparController::class, 'getFilterOptions'])->name('filterOptions');
    });

    Route::prefix('fire-safety')->name('hydrant.')->group(function () {
        Route::resource('hydrant', HydrantController::class)->parameters(['hydrant' => 'id'])->names('hydrant');
        Route::get('/hydrant/{id}/generate-qr', [HydrantController::class, 'HydrantQRCode'])->name('generateQRCode');
        Route::get('/hydrant/generate-mass-qr', [HydrantController::class, 'generateMassHydrantQRCode'])->name('generateMassQRCode');
        Route::get('/hydrant/upload-excel', [HydrantController::class, 'showUploadForm'])->name('uploadExcel');
        Route::post('/hydrant/import', [HydrantController::class, 'import'])->name('import');
        Route::get('/hydrant/filter-options', [HydrantController::class, 'getFilterOptions'])->name('filterOptions');
    });

    Route::prefix('fire-safety')->name('cekpoin-security.')->group(function () {
        Route::resource('cekpoin-security', CekpointSecurityController::class)
            ->parameters(['cekpoin-security' => 'id'])
            ->names('cekpoin-security');
        Route::get('/cekpoin-security/{id}/generate-qr', [CekpointSecurityController::class, 'generateMassCekPointQRCode'])->name('generateQRCode');
        Route::get('/cekpoin-security/print-qrcode', [CekpointSecurityController::class, 'generateMassCekPointQRCode'])->name('print-qrcode');
        Route::get('/cekpoin-security/qr/options', [CekpointSecurityController::class, 'getFilterOptions'])->name('filter.options');
        Route::get('/cekpoin-security/upload', [CekpointSecurityController::class, 'showUploadForm'])->name('upload');
        Route::post('/cekpoin-security/import', [CekpointSecurityController::class, 'import'])->name('import');
    });

    // Inspection CRUD
    Route::prefix('inspection')->name('inspection.')->group(function () {
        Route::resource('apar', AparInspectionController::class)
            ->parameters(['apar' => 'id'])
            ->names('apar');
        Route::resource('hydrant', HydrantInspectionController::class)
            ->parameters(['hydrant' => 'id'])
            ->names('hydrant');
        Route::resource('cekpoint-security', CPSecurityInspectionController::class)
            ->parameters(['cp-security' => 'id'])
            ->names('cp-security');

        Route::get('apar-inspeksi/{id}', [InspectionController::class, 'aparinspeksi'])->name('apar.inspection');
        Route::get('hydrant-inspeksi/{id}', [InspectionController::class, 'hydrantinspeksi'])->name('hydrant.inspection');
        Route::get('cekpoint-inspeksi/{id}', [InspectionController::class, 'cpinspeksi'])->name('cp.inspection');
    });

    // Reports / Rekap
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/apar-rekap', [AparInspectionController::class, 'rekap'])->name('apar.rekap');
        Route::get('/hydrant-rekap', [HydrantInspectionController::class, 'rekap'])->name('hydrant.rekap');
        Route::get('/cekpoint-rekap', [CPSecurityInspectionController::class, 'rekap'])->name('cekpoint.rekap');
        Route::get('/apar-rekap/pdf', [AparInspectionController::class, 'exportPdf'])->name('apar.pdf');
        Route::get('/hydrant-rekap/pdf', [HydrantInspectionController::class, 'exportPdf'])->name('hydrant.pdf');
        Route::get('/cekpoint-rekap/pdf', [CPSecurityInspectionController::class, 'exportPdf'])->name('cekpoint.pdf');
    });

    // Master Data
    Route::prefix('master-data')->name('master.')->group(function () {
        Route::resource('pengguna', UserController::class)->parameters(['pengguna' => 'id'])->names('pengguna');
        Route::resource('unit-bisnis', OfficesController::class)->parameters(['unit-bisnis' => 'id'])->names('unit-bisnis');
        Route::post('unit-bisnis/bulk-delete', [OfficesController::class, 'bulkDelete'])->name('unit-bisnis.bulk-delete');
        Route::resource('departemen', DepartmentController::class)->parameters(['departemen' => 'id'])->names('departemen');
        Route::post('departemen/bulk-delete', [DepartmentController::class, 'bulkDelete'])->name('departemen.bulk-delete');
        Route::resource('jabatan', JabatanController::class)->parameters(['jabatan' => 'id'])->names('jabatan');
        Route::post('jabatan/bulk-delete', [JabatanController::class, 'bulkDelete'])->name('jabatan.bulk-delete');
        Route::resource('karyawan', KaryawanController::class)->parameters(['karyawan' => 'id'])->names('karyawan');
    });
});

require __DIR__.'/settings.php';
