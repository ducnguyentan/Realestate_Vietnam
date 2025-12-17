export enum UserRole {
  ADMIN = 'admin',
  BUYER = 'buyer',
  SELLER = 'seller',
  AGENT = 'agent',
}

export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: ['*'],
  [UserRole.SELLER]: [
    'listing:create',
    'listing:read',
    'listing:update',
    'listing:delete',
    'deal:read',
    'deal:update',
  ],
  [UserRole.BUYER]: ['listing:read', 'deal:create', 'deal:read', 'deal:update'],
  [UserRole.AGENT]: [
    'listing:create',
    'listing:read',
    'listing:update',
    'deal:create',
    'deal:read',
    'deal:update',
  ],
} as const;
