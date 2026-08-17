<?php

namespace App\Traits;

use chillerlan\QRCode\Output\QRGdImagePNG;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;

trait GeneratesQrCode
{
    /**
     * Render a QR code as a binary PNG string.
     *
     * Uses chillerlan/php-qrcode (GD-based) — compatible with the GD
     * extension available in this environment. Replaces the old
     * simplesoftwareio/simple-qrcode facade, which cannot be installed
     * because Laravel Fortify pins bacon/bacon-qr-code to v3 (incompatible
     * with simple-qrcode, which needs bacon ^2.0). The PNG output keeps the
     * existing Intervention Image -> PDF pipeline unchanged.
     */
    protected function qrPng(string $content, int $size = 300): string
    {
        $options = new QROptions([
            'outputInterface' => QRGdImagePNG::class,
            'scale' => max(2, (int) round($size / 33)),
            'outputBase64' => false,
        ]);

        return (new QRCode($options))->render($content);
    }
}
