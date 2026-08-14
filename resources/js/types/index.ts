export type * from './auth';
export type * from './navigation';
export type * from './ui';

// Apar types
export interface Apar {
    id: number;
    kode_apar: string;
    lantai: string | null;
    lokasi: string;
    jenis: string;
    size: number;
    user_id: number | null;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

export const aparJenisApar = ['CO2', 'Powder', 'Foam', 'Air'] as const;
export type AparJenis = typeof aparJenisApar[number];
export const aparSizes = [2, 4, 6, 9] as const;
export type AparSize = typeof aparSizes[number];

export type * from './auth';
export type * from './navigation';
export type * from './ui';