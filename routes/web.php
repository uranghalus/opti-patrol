<?php

use App\Http\Controllers\Auth\OIDCController;
use App\Http\Controllers\AparController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/auth/redirect')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('inspection', 'inspection/index')->name('inspection');
    Route::inertia('reports', 'reports/index')->name('reports');

    // CRUD Data APAR
    Route::prefix('fire-safety/apar')->name('apar.')->group(function () {
        Route::resource('/', AparController::class)->except(['show']);
        Route::get('/{id}/generate-qr', [AparController::class, 'generateQRCode'])->name('generateQRCode');
        Route::get('/generate-mass-qr', [AparController::class, 'generateMassQRCode'])->name('generateMassQRCode');
        Route::get('/upload-excel', [AparController::class, 'showUploadForm'])->name('uploadExcel');
        Route::post('/import', [AparController::class, 'import'])->name('import');
        Route::get('/filter-options', [AparController::class, 'getFilterOptions'])->name('filterOptions');
    });
});
Route::get('auth/redirect', [OIDCController::class, 'redirect'])->name('authsso');
Route::get('auth/oidc/callback', [OIDCController::class, 'callback'])->name('ssocallback');
Route::get('auth/error', function () {
    $message = session('error', 'Terjadi kesalahan saat login SSO.');
    return response("<h1>Login Gagal</h1><p>{$message}</p><p><a href='/auth/redirect'>Coba lagi</a></p>", 500)
        ->header('Content-Type', 'text/html');
})->name('auth.error');
require __DIR__ . '/settings.php';
