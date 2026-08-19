import { usePage } from '@inertiajs/react';

type PermissionMap = Record<string, boolean> | undefined;

/**
 * Mirror of binta's @/lib/permission helper.
 * Reads the permission map shared from HandleInertiaRequests (auth.permissions).
 */
export function HasAnyPermission(permissions: string[]): boolean {
    const { props } = usePage();
    const perms = (props.auth as { permissions?: PermissionMap } | undefined)?.permissions;

    if (!perms) {
        return false;
    }

    return permissions.some((permission) => Boolean(perms[permission]));
}

export function can(permission: string): boolean {
    return HasAnyPermission([permission]);
}
