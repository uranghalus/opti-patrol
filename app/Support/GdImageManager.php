<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;

/**
 * GD-based image manager implementing Intervention Image v3 API.
 * Used as a drop-in replacement since Laravel 13's native Illuminate\Image
 * and Intervention Image v4 have incompatible APIs.
 */
class GdImageManager
{
    private $image; // GD image resource

    /**
     * Create a new blank image.
     */
    public function create(int $width, int $height): self
    {
        $this->image = imagecreatetruecolor($width, $height);
        // Fill white by default (matching Intervention's default)
        $white = imagecolorallocate($this->image, 255, 255, 255);
        imagefill($this->image, 0, 0, $white);

        return $this;
    }

    /**
     * Fill the image with a color.
     */
    public function fill(string $color): self
    {
        $c = $this->parseColor($color);
        imagefill($this->image, 0, 0, $c);

        return $this;
    }

    /**
     * Read image from various input types.
     */
    public function read($input): self
    {
        $binary = $this->toBinary($input);
        $res = @imagecreatefromstring($binary);
        if ($res === false) {
            throw new \RuntimeException('Unable to read image.');
        }
        $this->image = $res;

        return $this;
    }

    /**
     * Resize image maintaining aspect ratio if height is null.
     */
    public function resize(int $width, ?int $height = null): self
    {
        $srcW = imagesx($this->image);
        $srcH = imagesy($this->image);
        $dstW = $width;
        $dstH = $height ?? (int) round($srcH * ($width / $srcW));

        $dst = imagecreatetruecolor($dstW, $dstH);
        imagecopyresampled($dst, $this->image, 0, 0, 0, 0, $dstW, $dstH, imagesx($this->image), imagesy($this->image));
        $this->image = $dst;

        return $this;
    }

    /**
     * Place another image onto this image.
     */
    public function place(self $other, string $position = 'center', int $offsetX = 0, int $offsetY = 0): self
    {
        $src = $other->getResource();
        $srcW = imagesx($src);
        $srcH = imagesy($src);
        $dstW = imagesx($this->image);
        $dstH = imagesy($this->image);

        [$x, $y] = $this->computePosition($position, $dstW, $dstH, $srcW, $srcH);
        $x += $offsetX;
        $y += $offsetY;

        imagecopy($this->image, $src, $x, $y, 0, 0, $srcW, $srcH);

        return $this;
    }

    /**
     * Get image width.
     */
    public function width(): int
    {
        return imagesx($this->image);
    }

    /**
     * Get image height.
     */
    public function height(): int
    {
        return imagesy($this->image);
    }

    /**
     * Output as JPEG binary string.
     */
    public function toJpeg(int $quality = 75): string
    {
        ob_start();
        imagejpeg($this->image, null, $quality);

        return ob_get_clean();
    }

    /**
     * Output as WebP binary string.
     */
    public function toWebp(int $quality = 80): string
    {
        ob_start();
        imagewebp($this->image, null, $quality);

        return ob_get_clean();
    }

    /**
     * Output as PNG binary string.
     */
    public function toPng(): string
    {
        ob_start();
        imagepng($this->image);

        return ob_get_clean();
    }

    /**
     * Get underlying GD resource.
     */
    public function getResource()
    {
        return $this->image;
    }

    // --- Helpers ---

    private function computePosition(string $position, int $dw, int $dh, int $sw, int $sh): array
    {
        $x = (int) (($dw - $sw) / 2);
        $y = (int) (($dh - $sh) / 2);

        switch ($position) {
            case 'top-left':    $x = 0;
                $y = 0;
                break;
            case 'top':         $y = 0;
                break;
            case 'top-right':   $x = $dw - $sw;
                $y = 0;
                break;
            case 'left':        $x = 0;
                break;
            case 'right':       $x = $dw - $sw;
                break;
            case 'bottom-left': $x = 0;
                $y = $dh - $sh;
                break;
            case 'bottom':      $y = $dh - $sh;
                break;
            case 'bottom-right':$x = $dw - $sw;
                $y = $dh - $sh;
                break;
                // 'center' is default
        }

        return [$x, $y];
    }

    private function parseColor(string $color): int
    {
        $hex = ltrim($color, '#');
        if (strlen($hex) === 3) {
            $hex = $hex[0].$hex[0].$hex[1].$hex[1].$hex[2].$hex[2];
        }
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));

        return imagecolorallocate($this->image, $r, $g, $b);
    }

    private function toBinary($input): string
    {
        if (is_string($input)) {
            return $input;
        }
        if ($input instanceof UploadedFile) {
            return file_get_contents($input->getRealPath());
        }
        if (is_resource($input)) {
            $pos = ftell($input);
            $content = stream_get_contents($input);
            if ($pos !== false) {
                fseek($input, $pos);
            }

            return $content;
        }
        if (method_exists($input, 'getContent')) {
            return $input->getContent();
        }
        if (method_exists($input, 'getRealPath')) {
            return file_get_contents($input->getRealPath());
        }
        throw new \RuntimeException('Unsupported image input.');
    }
}
