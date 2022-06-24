<?php

namespace App\Core\Permissions;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class StaffPermissions
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

        // Staff
        'add staff',
        'view staff',
        'update staff',
        'delete staff',

        // Jobs
        'add job',
        'view jobs',
        'update job',
        'delete job',

        // Job Items
        'add job item',
        'update job item',
        'delete job item',
        'view job items',

        // Job Parts
        'add job part',
        'update job part',
        'delete job part',
        'view job parts',

        // Account Settings
        'view account settings',
        'update account',

        // Account labour charge
        'update account labour charge',
        'update account currency',

        // Vehicles
        'view vehicles',
        'add vehicle',
        'update vehicle',
        'delete vehicle',

        // Invoice
        'view invoices',
        'add invoice',
        'update invoice',
        'delete invoice',

        // SMS
        'send sms',
        'add sms',
        'update sms',
        'delete sms',
        'view sms',

        // Email
        'send email',
        'add email',
        'update email',
        'delete email',
        'view email',

        // Role Manager
        'view roles',
        'add role',
        'delete role',
        'update role',

        // Opening Hours
        'view opening hours',
        'add opening hour',
        'update opening hour',
        'delete opening hour',

        // Stats
        'view stats',
    ];

    public static array $adminPermissions = [
        'admin_login',
    ];

    public static array $roles = [
        'account admin',
        'receptionist',
        'mechanic',
    ];

    /**
     * Creates all of the permissions
     */
    public static function createAllPermissions(): void
    {
        // Create all of the permissions
        foreach (self::$allPermissions as $permission) {
            Permission::findOrCreate($permission);
        }
    }

    /**
     * Create all the admin permissions
     */
    public static function createAdminPermissions(): void
    {
        foreach (self::$adminPermissions as $permission) {
            Permission::findOrCreate($permission);
        }
    }

    /**
     * Create the super admin role and give all permissions
     */
    public static function createSuperAdminRoleAndGiveAllPermissions(): void
    {
        // The super admin works via a gate in the AuthServiceProvider
        $role = Role::findOrCreate('Super Admin');
        $role->givePermissionTo(array_merge(self::$allPermissions, self::$adminPermissions));
    }

    /**
     * Create the account admin role and give permissions
     */
    public static function createAccountAdminRoleAndPermissions(): void
    {
        // Account admin
        $role = Role::findOrCreate('account admin');

        $allStaffPermissions = self::$allPermissions;

        foreach ($allStaffPermissions as $staffPermission) {
            $role->givePermissionTo($staffPermission);
        }
    }

    /**
     * Create the receptionist role and give specified permissions
     */
    public static function createReceptionistRoleAndPermissions(): void
    {
        // Receptionist role
        $role = Role::findOrCreate('receptionist');
        $role->givePermissionTo(
        // Customers
            'add customer',
            'view customers',
            'update customer',
            'delete customer',

            // Customer notes
            'add customer note',
            'view customer note',
            'delete customer note',
            'update customer note',

            // Jobs
            'add job',
            'view jobs',
            'update job',
            'delete job',

            // Job Items
            'add job item',
            'update job item',
            'delete job item',
            'view job items',

            // Job Parts
            'add job part',
            'update job part',
            'delete job part',
            'view job parts',

            // Vehicles
            'view vehicles',
            'add vehicle',
            'update vehicle',
            'delete vehicle',

            // Staff
            'view staff',

            // SMS
            'send sms',

            // Email
            'send email',

            // Invoices
            'view invoices',
            'add invoice',
            'update invoice',
            'delete invoice',

            // Opening Hours
            'view opening hours',
            'add opening hour',
            'update opening hour',
            'delete opening hour',

            // Stats
            'view stats',
        );
    }

    /**
     * Create the admin role and give the specified permissions
     */
    public static function createMechanicRoleAndPermissions(): void
    {
        // Mechanic role
        $role = Role::findOrCreate('mechanic');
        $role->givePermissionTo(
        // Customers
            'add customer',
            'view customers',
            'update customer',
            'delete customer',

            // Customer notes
            'add customer note',
            'view customer note',
            'delete customer note',
            'update customer note',

            // Jobs
            'add job',
            'view jobs',
            'update job',
            'delete job',

            // Job Items
            'add job item',
            'update job item',
            'delete job item',
            'view job items',

            // Job Parts
            'add job part',
            'update job part',
            'delete job part',
            'view job parts',

            // Vehicles
            'view vehicles',
            'add vehicle',
            'update vehicle',
            'delete vehicle',

            // Staff
            'view staff',

            // SMS
            'send sms',

            // Stats
            'view stats',
        );
    }

    /**
     * Gets all the roles from the form input
     *
     * @param Request $request
     * @return array
     */
    public static function extractRolesFormRequestData(Request $request): array
    {
        $roles = [];
        foreach ($request->all() as $roleAndId => $checked) {
            if (!$checked) {
                continue;
            }

            if (strpos($roleAndId, 'role_') === false) {
                continue;
            }

            $roleId = (int)str_replace('role_', '', $roleAndId);
            $role = Role::find($roleId);

            $roles[] = $role;
        }

        return $roles;
    }
}
