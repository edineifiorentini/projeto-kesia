export type Role =
  | "super_admin"
  | "business_owner"
  | "manager"
  | "receptionist"
  | "professional"
  | "inventory_manager"
  | "client";

export type Permission =
  | "appointments:manage"
  | "clients:manage"
  | "professionals:manage"
  | "services:manage"
  | "commands:manage"
  | "financial:manage"
  | "inventory:manage"
  | "reports:export"
  | "discounts:approve"
  | "payments:cancel"
  | "commissions:change"
  | "settings:manage";

const rolePermissions: Record<Role, Permission[]> = {
  super_admin: [
    "appointments:manage",
    "clients:manage",
    "professionals:manage",
    "services:manage",
    "commands:manage",
    "financial:manage",
    "inventory:manage",
    "reports:export",
    "discounts:approve",
    "payments:cancel",
    "commissions:change",
    "settings:manage",
  ],
  business_owner: [
    "appointments:manage",
    "clients:manage",
    "professionals:manage",
    "services:manage",
    "commands:manage",
    "financial:manage",
    "inventory:manage",
    "reports:export",
    "discounts:approve",
    "payments:cancel",
    "commissions:change",
    "settings:manage",
  ],
  manager: [
    "appointments:manage",
    "clients:manage",
    "professionals:manage",
    "services:manage",
    "commands:manage",
    "financial:manage",
    "inventory:manage",
    "reports:export",
    "discounts:approve",
  ],
  receptionist: ["appointments:manage", "clients:manage", "commands:manage"],
  professional: ["appointments:manage", "clients:manage"],
  inventory_manager: ["inventory:manage", "reports:export"],
  client: [],
};

export function hasPermission(role: Role, permission: Permission) {
  return rolePermissions[role].includes(permission);
}

export function requirePermission(role: Role, permission: Permission) {
  if (!hasPermission(role, permission)) {
    throw new Error(`Forbidden: ${permission}`);
  }
}

export function canAccessTenant(
  sessionBusinessId: string | null,
  requestedBusinessId: string,
  role: Role,
) {
  return role === "super_admin" || sessionBusinessId === requestedBusinessId;
}
