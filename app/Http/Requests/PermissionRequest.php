<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PermissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $permissionId = $this->route('permission')?->id ?? $this->route('id');

        if ($this->isMethod('post') || $this->isMethod('put')) {
            if ($this->has('names')) {
                // Bulk create
                return [
                    'names' => 'required|array|min:1',
                    'names.*' => 'required|string|max:255|distinct',
                    'guard_name' => 'required|string|in:web,api',
                ];
            }

            // Single create/update
            return [
                'name' => [
                    'required',
                    'string',
                    'max:255',
                    'unique:permissions,name,'.$permissionId.',guard_name,'.($this->input('guard_name') ?? 'web'),
                    'regex:/^[a-zA-Z0-9_\-\s]+$/',
                ],
                'guard_name' => 'required|string|in:web,api',
            ];
        }

        return [];
    }

    public function messages(): array
    {
        return [
            'names.required' => 'Daftar nama permission wajib diisi.',
            'names.array' => 'Format nama permission tidak valid.',
            'names.min' => 'Minimal 1 permission harus diisi.',
            'names.*.required' => 'Nama permission tidak boleh kosong.',
            'names.*.max' => 'Nama permission maksimal 255 karakter.',
            'names.*.distinct' => 'Nama permission tidak boleh duplikat.',
            'name.required' => 'Nama permission wajib diisi.',
            'name.max' => 'Nama permission maksimal 255 karakter.',
            'name.unique' => 'Nama permission sudah digunakan untuk guard ini.',
            'name.regex' => 'Nama permission hanya boleh mengandung huruf, angka, underscore, dan spasi.',
            'guard_name.required' => 'Guard wajib dipilih.',
            'guard_name.in' => 'Guard harus web atau api.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'nama permission',
            'names' => 'daftar permission',
            'guard_name' => 'guard',
        ];
    }
}
