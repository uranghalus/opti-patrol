<!DOCTYPE html>
<html>

<head>
    <style>
        body {
            font-family: sans-serif;
            text-align: center;
        }

        .label {
            font-size: 18px;
            margin-top: 20px;
            font-weight: bold;
            text-align: center;
            padding: 10px;
            border: 2px solid #000;
            border-radius: 5px;
        }

        .qr-code {
            border: 10px solid #000;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            background: #000;
            width: 200px;
            height: 200px;
            display: inline-block;
        }

        .qr-code-container {
            display: inline-block;
            text-align: center;
            margin: 20px;
            padding: 15px;
            border: 2px solid #000;
            border-radius: 10px;
        }
    </style>
</head>

<body>
    <div class="qr-code-container">
        <img src="{{ $qr_base64 }}" alt="QR Code" class="qr-code">
        <div class="label">Kode Apar: {{ $kode_apar }}</div>
    </div>
</body>

</html>