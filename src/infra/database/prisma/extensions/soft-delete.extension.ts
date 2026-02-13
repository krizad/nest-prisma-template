import { Prisma } from '@prisma/client';

/**
 * Soft delete extension for Prisma
 * This extension is disabled as the schema no longer uses deletedAt field
 * To enable soft deletes, add 'deletedAt DateTime?' field back to User model in schema.prisma
 */
export const softDeleteExtension = Prisma.defineExtension({
  name: 'softDelete',
  query: {
    // Extension is currently disabled - no soft delete filtering applied
  },
});

/**
 * Helper type for models that support soft delete
 */
export type WithSoftDelete<T> = T & {
  deletedAt: Date | null;
};
