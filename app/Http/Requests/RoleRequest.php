<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $roleId = $this->route('role')?->id ?? $this->route('id');

        return [
            'name' => [
                'required',
                'string',
                'min:3',
                'max:255',
                'unique:roles,name,'.$roleId,
                'regex:/^[a-zA-Z0-9_\-\s]+$/',
            ],
            'guard_name' => 'nullable|string|in:web,api',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama role wajib diisi.',
            'name.min' => 'Nama role minimal 3 karakter.',
            'name.max' => 'Nama role maksimal 255 karakter.',
            'name.unique' => 'Nama role sudah digunakan.',
            'name.regex' => 'Nama role hanya boleh mengandung huruf, angka, underscore, dan spasi.',
            'permissions.*.exists' => 'Izin yang dipilih tidak valid.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'nama role',
            'guard_name' => 'guard',
            'permissions' => 'izin',
        ];
    }
}
