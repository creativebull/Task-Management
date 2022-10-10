<?php

namespace App\Core\Permissions;

use Spatie\Permission\Models\Role;

class UserPermissions
{
    public static array $allPermissions = [
        // Customers
        'add customer',
        'view customers',
        'update customer',
        'delete customer',
        'export customer data',
        'import customer data',

        // Customer notes
        'add customer note',
        'view customer note',
        'delete customer note',
        'update customer note',

        // Stats
        'view stats',
    ];

    public static array $adminPermissions = [
        'admin_login',
    ];

    public static array $roles = [
        'account admin',
    ];

    /**
     * Create the super admin role and give all permissions
     */
    public static function createSuperAdminRoleAndGiveAllPermissions(): void
    {
        // The super admin works via a gate in the AuthServiceProvider
        $role = Role::findOrCreate('Super Admin');
        $role->givePermissionTo(array_merge(self::$allPermissions, self::$adminPermissions))->save();
    }
}
