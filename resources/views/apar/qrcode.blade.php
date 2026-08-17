<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>QR Code APAR</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 20mm;
        }
        .container {
            text-align: center;
            max-width: 100%;
        }
        .qr-container {
            margin-bottom: 20px;
        }
        .qr-image {
            max-width: 100%;
            height: auto;
            border: 1px solid #e0e0e0;
            padding: 10px;
            background: #fff;
        }
        .code {
            font-family: 'Courier New', monospace;
            font-size: 24px;
            font-weight: bold;
            color: #333;
            letter-spacing: 2px;
        }
        .label {
            font-size: 14px;
            color: #666;
            margin-bottom: 8px;
        }
        @page {
            margin: 15mm;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="label">Kode APAR</div>
        <div class="code">{{ $kode_apar }}</div>
        <div class="qr-container">
            <img src="{{ $qr_base64 }}" alt="QR Code" class="qr-image">
        </div>
    </div>
</body>
</html>