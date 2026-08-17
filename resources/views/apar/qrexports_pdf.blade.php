<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>QR Code APAR Batch</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 15mm;
        }
        .batch-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e0e0e0;
        }
        .batch-title {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }
        .batch-info {
            font-size: 12px;
            color: #666;
        }
        .qr-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
        }
        .qr-card {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            background: #fff;
            page-break-inside: avoid;
        }
        .qr-image {
            width: 80px;
            height: 80px;
            margin: 0 auto 10px;
            border: 1px solid #e0e0e0;
            padding: 5px;
            background: #fff;
        }
        .qr-code-text {
            font-family: 'Courier New', monospace;
            font-size: 14px;
            font-weight: bold;
            color: #333;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }
        .qr-location {
            font-size: 11px;
            color: #666;
            margin-bottom: 2px;
        }
        .qr-floor {
            font-size: 11px;
            color: #999;
        }
        @page {
            margin: 10mm;
        }
        @media print {
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="batch-header">
        <div class="batch-title">QR Code APAR - Batch {{ $batch }}</div>
        <div class="batch-info">
            Lantai: {{ $lantai ?? 'Semua Lantai' }} | Tanggal: {{ now()->format('d/m/Y') }}
        </div>
    </div>

    <div class="qr-grid">
        @foreach($apars as $apar)
            <div class="qr-card">
                <img src="{{ $apar['qr_base64'] }}" alt="QR Code {{ $apar['kode_apar'] }}" class="qr-image">
                <div class="qr-code-text">{{ $apar['kode_apar'] }}</div>
                <div class="qr-location">{{ $apar['lokasi'] }}</div>
                <div class="qr-floor">Lantai: {{ $apar['lantai'] ?? '-' }}</div>
            </div>
        @endforeach
    </div>
</body>
</html>